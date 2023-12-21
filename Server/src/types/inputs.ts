import { Schema, Types } from "mongoose"
import Event from './event.js';

export type inputGetEventsByUser = {
    userId: Types.ObjectId
}

export type inputUserDetails = {
    userId: Types.ObjectId
    userEmail: string
    // jwtToken: string
    // password: string
}

export type inputAddOrUpdateEvent = {
    event: Event,
    userDetails: inputUserDetails
}

export type inputDeleltEvent = {
    userDetails: inputUserDetails
    eventId: Schema.Types.ObjectId
}