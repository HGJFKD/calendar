import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import Header from "../components/Header";
import { tokens } from "../theme/theme";
import { DateSelectArg, EventApi, EventClickArg, ViewApi } from "fullcalendar/index.js";

const Calendar: React.FC = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState<EventClickArg[]>([]);

    const handleDateClick = (selected: DateSelectArg) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${selected.startStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
            });
        }
    };

    const handleEventClick = (selected: EventClickArg) => {
        if (
            window.confirm(
                `Are you sure you want to delete the event '${selected.event.title}'`
            )
        ) {
            selected.event.remove();
        }
    };

    const handleEventsSet = (events: EventApi[]) => {
        const eventClickArgs: EventClickArg[] = events.map((event) => ({
            el: document.createElement('div'),
            event: event as EventClickArg['event'],
            jsEvent: new MouseEvent('click'),
            view: null as unknown as ViewApi,
        }));
        setCurrentEvents(eventClickArgs);
    };

    return (
        <Box m="20px">
            <Header title="Calendar" subtitle="Your personal event diary" />

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
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.event.id}
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                    margin: "10px 0",
                                    borderRadius: "2px",
                                }}
                            >
                                <ListItemText
                                    primary={event.event.title}
                                    secondary={
                                        <Typography>
                                            {event.event.start!.toLocaleDateString()}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
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
                        eventsSet={handleEventsSet}
                        initialEvents={[
                            {
                                id: "12315",
                                title: "All-day event",
                                start: "2022-09-14",
                            },
                            {
                                id: "5123",
                                title: "Timed event",
                                start: "2022-09-28",
                            },
                        ]}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;