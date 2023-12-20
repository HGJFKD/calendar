import { gql } from "@apollo/client";

export const getEventsByUser = gql`
query {
  getEventsByUser(input: { userId: "657eea474cdac19c724b0910" }) {
    _id
    first_name
    last_name
    email
    timeZone
    events{
      eventName
      start
      end
      location
      guests {
        guestFirstName
        guestLastName
        guestEmail
        timeZone
      }
      description
      repetitiveness
      reminders {
        definitionOfDuratios
        amountOftimeBefore
        ReminderType
      }
      availability
    }
  }
}
`