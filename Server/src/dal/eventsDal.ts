import { Schema, Types } from "mongoose"
import {
    inputAddOrUpdateEvent,
    inputDeleltEvent,
    inputGetEventsByUser
} from "../types/inputs.js"
import eventModel from "../models/eventModel.js"
import RequestError from "../types/errors/RequestError.js"
import STATUS_CODES from "../utils/StatusCodes.js"
import { userEvents } from "../types/user.js"
import Redis from "../redis/redis.js"
import userDal from "./userDal.js"
import Event from '../types/event.js';


const throwErrorIfNotUserId = () => {
    throw new RequestError(
        'Field userId is Required',
        STATUS_CODES.BAD_REQUEST
    )
}

// Get all events by user func
const getEventsByUser = async (input: inputGetEventsByUser)
    : Promise<userEvents | null> => {
    const { userId } = input

    // throw error if not userId
    if (!userId) {
        throwErrorIfNotUserId()
    }

    try {

        // Check if the user exists
        await userDal.findUserById(userId);

        // Get or set from redis or db
        const res = await Redis.getOrSetCache(

            // First argument to search at redis
            `events?_id=${userId}`,

            // Second argument cb func, if not in redis
            async () => {
                const data = await eventModel.findById(userId).exec();
                return data;
            })
        console.log(res);

        return res as unknown as userEvents

    } catch (error) {
        throw new RequestError(
            error as unknown as string,
            STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    }
}


const addEvent = async (input: inputAddOrUpdateEvent)
    : Promise<userEvents | null> => {
    const { event, userDetails } = input
    const { userId } = userDetails

    // throw error if not userId
    if (!userId) {
        throwErrorIfNotUserId()
    }

    try {

        // Check if the user exists
        await userDal.findUserById(userId);

        const res = await Redis.getOrSetCache(

            // First argument to search at redis
            `events?_id=${userId}`,

            // Second argument cb func, if not in redis
            async () => {
                const user = await eventModel.findByIdAndUpdate(
                    userDetails.userId,
                    { $push: { events: event } },
                    { new: true }
                ).exec();

                if (!user) {
                    throw new RequestError(
                      `Error adding event to User: ${userDetails.userEmail}`,
                      STATUS_CODES.INTERNAL_SERVER_ERROR
                    );
                  }
                return user
            },

            // Third argument, optionall cb argument:
            // if there are at redis: do this operation below

            await Redis.processEvent(userId, event)
        )

        return res as unknown as userEvents

    } catch (error) {
        throw new RequestError(
            `Error adding event to User: ${userDetails.userEmail}`,
            STATUS_CODES.INTERNAL_SERVER_ERROR
        )
    }
}

const updateEvent = async (input: inputAddOrUpdateEvent) => {

}

const deleteEvent = async (input: inputDeleltEvent): Promise<Schema.Types.ObjectId> => {
    return input.eventId
}

const eventDal = {
    throwErrorIfNotUserId,
    getEventsByUser,
    addEvent,
    updateEvent,
    deleteEvent,
}

export default eventDal