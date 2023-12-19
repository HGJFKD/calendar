import { DateTimeResolver } from 'graphql-scalars';
import { GraphQLError } from "graphql";
import eventDal from '../dal/eventsDal.js';
import Event from "../types/event.js"
import {
    inputAddOrUpdateEvent,
    inputDeleltEvent,
    inputGetEventsByUser
} from '../types/inputs.js';
import User from '../types/user.js';
import userDal from '../dal/userDal.js';


export const resolvers = {
    Date: DateTimeResolver,

    Query: {

        getEventsByUser: async (parent: any, args: { input: inputGetEventsByUser }) => {
            await eventDal.getEventsByUser(args.input)
        },
    },

    Mutation: {

        addUser: async (parent: any, args: { input: User }) => {
            const result = await userDal.addUser(args.input)
            return result
        },

        addEvent: async (parent: any, args: { input: inputAddOrUpdateEvent }) => {
            const result = await eventDal.addEvent(args.input)
            return result
        },

        updateEvent: async (parent: any, args: { input: inputAddOrUpdateEvent }) => {
            return await eventDal.updateEvent(args.input)
        },

        deleteEvent: async (parent: any, args: { input: inputDeleltEvent }) => {
            try {

                const response = await eventDal.deleteEvent(args.input)
                if (!response) {
                    throw new GraphQLError("Failed to delete event", { extensions: { http: { status: 500 } } });
                }
                return { message: "User deleted successfully" };

            } catch (error) {
                throw new GraphQLError("An error occurred during user deletion", { extensions: { http: { status: 500 } } });
            }
        },
    },

};