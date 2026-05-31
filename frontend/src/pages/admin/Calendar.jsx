import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "./adminComponents/Header";

import FullCalendar from "@fullcalendar/react"; // FullCalendar import first
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";

import { tokens } from "../../theme";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import LoadingScreen from "../../components/LoadingScreen";
import UseWindowSize from "../../hooks/UseWindowSize";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const dispatch = useDispatch();

  const [pageLoading, setPageLoading] = useState(true);  // Track event loading

  const { isLoading, user } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);  
    }, 100); // Simulate a 2-second loading delay
  }, []);


  const [currentEvents, setCurrentEvents] = useState([]);

  // Load events from local storage on mount
  useEffect(() => {
    const storedEvents =
      JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setCurrentEvents(storedEvents);
  }, []);

  // Save events to local storage
  const saveEventsToLocalStorage = (events) => {
    const serializedEvents = events.map(
      ({ id, title, start, end, allDay }) => ({
        id,
        title,
        start,
        end,
        allDay,
      })
    );

    localStorage.setItem("calendarEvents", JSON.stringify(serializedEvents));
  };

  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEventId = `${selected.dateStr}-${title.replace(
        /\s+/g,
        "-"
      )}-${Date.now()}`; // Replace spaces with hyphens and add timestamp
      const newEvent = {
        id: newEventId,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };
      calendarApi.addEvent(newEvent);

      // Update state and local storage
      const updatedEvents = [...currentEvents, newEvent];
      setCurrentEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    }
  };

  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();

      // Update state and local storage
      const updatedEvents = currentEvents.filter(
        (event) => event.id !== selected.event.id
      );
      setCurrentEvents(updatedEvents);
      saveEventsToLocalStorage(updatedEvents);
    }
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = currentEvents.filter(event => event.id !== eventId);
    setCurrentEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents);
  };



  

  return (
    <>
      {isLoading || !user || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box
          m={{ xs: "10px", md: "20px" }}
          height={"90vh"}
          overflow={{xs:"auto", md :"hidden"}}
          pb={5}
        >
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Header
              title={"Calender"}
              subtitle={"Set up to do later in your calender"}
            />
          </Stack>

          <Box
            display={"flex"}
            justifyContent={"space-between"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            {/* CALENDAR SIDEBAR */}
            <Box
              flex={{xs:"", md: "1 1 35%", xl: "1 1 25%" }}
              backgroundColor={colors.primary[400]}
              p="15px"
              borderRadius="4px"
              height={{xs: "420px", md: size.height - 180}}
              overflow={"auto"}
            >
              <Typography variant="h5">Events</Typography>
              <List>
                {currentEvents.length > 0 ? (
                  currentEvents.map((event) => (
                    <ListItem
                      key={event.id}
                      sx={{
                        backgroundColor: colors.greenAccent[500],
                        margin: "10px 0",
                        borderRadius: "2px",
                        position: "relative",
                      }}
                    >
                      <ListItemText
                        primary={event.title}
                        secondary={
                          <Typography>
                            {formatDate(event.start, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                            {event.extendedProps?.note && (
                              <Typography variant="body2" color="textSecondary">
                                {event.extendedProps.note}
                              </Typography>
                            )}
                          </Typography>
                        }
                      />
                      {/* Add delete button */}
                      <Box
                        sx={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <Button
                        size="small"
                        variant="contained"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent parent onClick from triggering
                            if (
                              window.confirm(
                                `Are you sure you want to delete '${event.title}'?`
                              )
                            ) {
                              // Remove the event
                              handleDeleteEvent(event.id);
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <ListItem
                    sx={{
                      backgroundColor: colors.greenAccent[500],
                      margin: "10px 0",
                      borderRadius: "2px",
                    }}
                  >
                    <ListItemText
                      primary={"YOU HAVE NO EVENT"}
                      secondary={
                        <Typography>
                          Click on any date to create a new event.
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Box>

            {/* CALENDAR */}
            <Box flex={"1 1 100%"}>
              <FullCalendar
                height={"75vh"}
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin,
                ]}
                headerToolbar={{
                  left: "prev,next,today",
                  center: "title",
                  right:
                    size.width > 600 &&
                    "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                events={currentEvents} // Use currentEvents to display events
              />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Calendar;
