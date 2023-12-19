export default interface Event {
    eventName: string,
    stert: Date,
    end: Date,
    timeZone: string,
    location: string,
    guests: Guest[],
    description: string,
    repetitiveness: string | Date | Date[],
    reminders: Reminder[]
    availability: AvailabilityEnum
}

export interface Guest {
    guestFirstName: string,
    guestLastName: string,
    guestEmail: string,
    timeZone: string
}

export interface Reminder {
    definionOfDuratios: DuratiosEnum,
    amountOftimeBefore: number,
    ReminderType: ReminderTypeEnum
}

export enum AvailabilityEnum {
    Available = "Available",
    NotAvailable = "Not available"
}

export enum DuratiosEnum {
    Minutes = "Minutes",
    Hours = "Hours",
    Daysays = "Daysays",
    Weeks = "Weeks"
}

export enum ReminderTypeEnum {
    Alert = "Alert",
    Amail = "Email"
}
