
import { gql } from 'apollo-server-express'
import { GraphQLScalarType, Kind } from 'graphql';

export const typeDefs = gql`
    scalar Date

# Type event
  enum AvailabilityEnum {
    Available
    NotAvailable
  }

  enum DuratiosEnum {
    Minutes
    Hours
    Days
    Weeks
  }

  enum ReminderTypeEnum {
    Alert
    Email
  }

  # Type input event

  input InputReminder {
    definitionOfDuratios: DuratiosEnum
    amountOftimeBefore: Int
    ReminderType: ReminderTypeEnum
  }

  input InputGuest {
    guestFirstName: String
    guestLastName: String
    guestEmail: String
    timeZone: String
  }

  input InputEvent {
    eventName: String
    start: Date
    end: Date
    timeZone: String
    location: String
    guests: [InputGuest]
    description: String
    repetitiveness: String
    reminders: [InputReminder]
    availability: AvailabilityEnum
  }

  # 
  
  type Reminder {
    definitionOfDuratios: DuratiosEnum
    amountOftimeBefore: Int
    ReminderType: ReminderTypeEnum
  }

  type Guest {
    guestFirstName: String
    guestLastName: String
    guestEmail: String
    timeZone: String
  }

  type Event {
    _id: String
    eventName: String
    start: Date
    end: Date
    timeZone: String
    location: String
    guests: [Guest]
    description: String
    repetitiveness: String
    reminders: [Reminder]
    availability: AvailabilityEnum
  }


# Type input User Details
  input inputUserDetails {
    userId: String
    userEmail: String
    # jwtToken: String
    # password: String
  }

  

  # Input type get events by user
  input inputGetEventsByUser {
    userId: String
  }

# Input type add event
input inputAddOrUpdateEvent {
    event: InputEvent,
    userDetails: inputUserDetails
  }

  input inputDeleltEvent {
    userDetails: inputUserDetails
    eventId: String
  }

  type DeleteEventResponse {
  message: String
}

  # Add new user
  input inputNewUser {
    first_name: String
    last_name: String
    email: String
    timeZone: String
    password: String
}

# Add user response 
type AddUserResponse {
  message: String
}

type eventsResponse {
  _id: String,
  first_name: String,
  last_name: String,
  email: String,
  timeZone: String,
  password: String,
  events: [Event]
}

  # Type Query
  type Query {

    # get
    getEventsByUser(input: inputGetEventsByUser): eventsResponse
    }

  #  Type Mutation
  type Mutation  {

    # add
    addEvent(input: inputAddOrUpdateEvent): eventsResponse
    addUser(input: inputNewUser): AddUserResponse

    # update
    updateEvent(input: inputAddOrUpdateEvent): Event

    # delete
    deleteEvent(input: inputDeleltEvent): DeleteEventResponse
  }

  type Subscription {
    messages: String
  }
  
`;