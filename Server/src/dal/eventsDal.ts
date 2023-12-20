import { Schema } from "mongoose"
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

const getEventsByUser = async (input: inputGetEventsByUser)
    : Promise<userEvents | null> => {
    const { userId } = input
    try {
        if (!userId) {
            throw new RequestError(
                'Field userId is Required',
                STATUS_CODES.BAD_REQUEST
            )
        }

        // Check if the user exists
        await userDal.findUserById(userId);


        const res = await Redis.getOrSetCache(`events?_id=${userId}`, async () => {
            const data = await eventModel.findById(userId).exec();
            console.log("data:", data);
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

    try {

        if (!userId) {
            throw new RequestError(
                'Field userId is Required',
                STATUS_CODES.BAD_REQUEST
            )
        }

        // Check if the user exists
        await userDal.findUserById(userId);

        const res = await eventModel.findByIdAndUpdate(
            userDetails.userId,
            { $push: { events: event } },
            { new: true }
        ).exec();

        return res as unknown as userEvents;

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
    getEventsByUser,
    addEvent,
    updateEvent,
    deleteEvent,
}

export default eventDal