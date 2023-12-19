import { Schema, model } from "mongoose";
import Event, { AvailabilityEnum, DuratiosEnum, ReminderTypeEnum, } from "../types/event.js"
import { userEvents } from "../types/user.js";

const eventSchema = new Schema<userEvents>(

    {
        first_name: String,
        last_name: String,
        email: String,
        timeZone: String,
        password: String,
        events: {
            type: [{
                eventName: String,
                stert: Date,
                end: Date,
                timeZone: String,
                location: String,
                guests: [
                    {
                        guestFirstName: String,
                        guestLastName: String,
                        guestEmail: String,
                        timeZone: String
                    }
                ],
                description: String,
                repetitiveness: Schema.Types.Mixed,
                reminders: [
                    {
                        definionOfDuratios: {
                            type: String,
                            enum: Object.values(DuratiosEnum),
                        },
                        amountOftimeBefore: Number,
                        ReminderType: {
                            type: String,
                            enum: Object.values(ReminderTypeEnum),
                        },
                    }
                ],
                availability: {
                    type: String,
                    enum: Object.values(AvailabilityEnum),
                }
            }],
            required: false
        }

    },
    {
        strict: true,
    }
)

const eventModel = model<userEvents>('events', eventSchema);

export default eventModel