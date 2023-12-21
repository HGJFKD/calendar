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
import pubsub from '../pubsub/pubsub.js';

export const resolvers = {
    Date: DateTimeResolver,

    Query: {

        getEventsByUser: async (parent: any, args: { input: inputGetEventsByUser }) => {
            const result = await eventDal.getEventsByUser(args.input)
            return result
        },
    },

    Mutation: {

        addUser: async (parent: any, args: { input: User }) => {
            const result = await userDal.addUser(args.input)
            return result
        },

        addEvent: async (_parent: any, args: { input: inputAddOrUpdateEvent }) => {

            pubsub.publish('EVENT_CREATED', { calendar: args.input.userDetails })

            const result = await eventDal.addEvent(args.input)
            return result
        },

        updateEvent: async (_parent: any, args: { input: inputAddOrUpdateEvent }) => {
            return await eventDal.updateEvent(args.input)
        },

        deleteEvent: async (_parent: any, args: { input: inputDeleltEvent }) => {
            try {

                const result = await eventDal.deleteEvent(args.input)
                if (!result) {
                    throw new GraphQLError("Failed to delete event", {
                        extensions: { http: { status: 500 } }
                    });
                }
                return { message: "User deleted successfully" };

            } catch (error) {
                throw new GraphQLError("An error occurred during user deletion", {
                    extensions: { http: { status: 500 } }
                });
            }
        },
    },

    Subscription: {
        calendar : {
          subscribe : () => pubsub.asyncIterator(['EVENT_CREATED'])
        }
    }

};