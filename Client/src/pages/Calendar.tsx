import React, { useState, useEffect } from "react";

import { useQuery, gql } from '@apollo/client'
import { getEventsByUser } from "../graphQl/Queries";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { DateSelectArg, EventApi, EventClickArg, ViewApi } from "fullcalendar/index.js";

import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme
} from "@mui/material";
import { tokens } from "../theme/theme";
import Event, { AvailabilityEnum } from '../types/event'

import Header from "../components/Header";
import Loading from "../components/Loading";

type ExtendedEventClickArg = {
    [K in keyof EventClickArg]: K extends "event"
    ? EventApi & { extendedProps: { event: Event } }
    : EventClickArg[K];
};

interface GetEventsByUserResponse {
    getEventsByUser: {
      events: Event[];
    };
  }

const Calendar: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { error, loading, data } = useQuery<GetEventsByUserResponse>(getEventsByUser)
    const [currentEvents, setCurrentEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (data) {
            setCurrentEvents(data.getEventsByUser.events)
        };
    }, [data])

    const handleDateClick = (selected: DateSelectArg) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            const newEvent: Event = {
                eventName: title,
                start: selected.start!,
                end: selected.end!,
                timeZone: "YourTimeZone",
                location: "EventLocation",
                guests: [],
                description: "EventDescription",
                repetitiveness: "EventRepetitiveness",
                reminders: [],
                availability: AvailabilityEnum.Available,
            };

            calendarApi.addEvent({
                id: `${selected.startStr}-${title}`,
                title: title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
                extendedProps: { event: newEvent },
            });
        }
    };

    const handleEventClick = (selected: EventClickArg) => {
        const fullEvent: Event = selected.event.extendedProps.event;
        if (
            window.confirm(
                `Are you sure you want to delete the event '${fullEvent.eventName}'`
            )
        ) {
            selected.event.remove();
        }
    };

    const handleEventsSet = (events: Event[]) => {
        const eventClickArgs: Event[] = events.map((event) => ({
            ...event,
            el: document.createElement('div'),
            event: {
                ...event,
                extendedProps: {
                    event: event
                },
            },
            jsEvent: new MouseEvent('click'),
            view: null as unknown as ViewApi,
        }));
        setCurrentEvents(eventClickArgs);
    };

    return (
        <Box m="20px">
            {loading ? <Loading /> :
                data &&
                <>
                    <Header
                        title="Calendar"
                        subtitle="Your personal event diary"
                    />
                    <Box display="flex" justifyContent="space-between">
                        {/* CALENDAR SIDEBAR */}
                        <Box
                            component="div"
                            flex="1 1 20%"
                            bgcolor={colors.primary[400]}
                            p="15px"
                            borderRadius="4px"
                        >
                            <Typography variant="h5">Events</Typography>
                            <List>
                                {currentEvents.map((event) => {
                                    return (
                                        <ListItem
                                            key={Number(event.start) +1}
                                            sx={{
                                                backgroundColor: colors.greenAccent[500],
                                                margin: "10px 0",
                                                borderRadius: "2px",
                                            }}
                                        >
                                            <ListItemText
                                                primary={event.eventName}
                                                secondary={
                                                    <Typography>
                                                        {event?.start instanceof Date && event.start.toLocaleDateString()}
                                                    </Typography>
                                                } />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Box>

                        {/* CALENDAR */}
                        <Box flex="1 1 100%" ml="15px">
                            <FullCalendar
                                height="75vh"
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                headerToolbar={{
                                    left: "prev,next today",
                                    center: "title",
                                    right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                                }}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                select={handleDateClick}
                                eventClick={handleEventClick}
                                eventsSet={(events) => handleEventsSet(events)}
                                initialEvents={data?.getEventsByUser?.events || []} />
                        </Box>
                    </Box></>
            }
        </Box>
    );
};

export default Calendar;