import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

export default function BookingCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/calendar");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
  
        const formattedEvents = data.map((event) => {
          const eventDate = moment(event.event_date, "YYYY-MM-DD");
          const startTime = moment(event.start_time, "HH:mm:ss");
          const endTime = moment(event.end_time, "HH:mm:ss");
  
          const startDate = eventDate
            .clone()
            .set({
              hour: startTime.hours(),
              minute: startTime.minutes(),
              second: startTime.seconds(),
            })
            .toDate();
  
          const endDate = eventDate
            .clone()
            .set({
              hour: endTime.hours(),
              minute: endTime.minutes(),
              second: endTime.seconds(),
            })
            .toDate();
  
          return {
            ...event,
            start: startDate,
            end: endDate,
          };
        });
  
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchEvents(); // Initial fetch
  
    const interval = setInterval(fetchEvents, 1000); // Auto-refresh every 60 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log("Selected event:", event);
  };


  const eventPropGetter = (event) => {
    let backgroundColor;
    const status = event.event_status?.toLowerCase(); // Handle null/undefined safely
    if (status === "confirmed") {
      backgroundColor = "green";
    } else if (status === "pending") {
      backgroundColor = "orange";
    } else if (status === "completed") {
      backgroundColor = "blue";
    }
    return { style: { backgroundColor, color: "white", borderRadius: "5px" } };
  };

  const handleAddBooking = async () => {
    // Collect the form data
    const newBooking = {
      event_type: eventType, // Assuming eventType is a state variable
      event_status: eventStatus, // Assuming eventStatus is a state variable
      start_time: moment(startTime).toISOString(), // Assuming startTime is a state variable
      end_time: moment(endTime).toISOString(), // Assuming endTime is a state variable
      event_date: moment(startTime).format("YYYY-MM-DD"), // Extract date only from start time
    };

    try {
      // Send the data to the backend using a POST request
      const response = await fetch("http://127.0.0.1:5000/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(newBooking), // Send the new booking data as the request body
      });

      // Handle the response
      const result = await response.json();

      if (result.message === "Booking added successfully") {
        // If successful, update the calendar or the state with the new booking
        setEvents((prevEvents) => [
          ...prevEvents, // Add the new event to the existing events
          newBooking, // Add the new booking
        ]);
        alert("Booking added successfully!");
      } else {
        alert("Failed to add booking.");
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred while adding the booking.");
    }
  };

  const handleSave = async () => {
    try {
      const updatedEvent = {
        event_type: selectedEvent.event_type,
        event_status: selectedEvent.event_status,
        start_time: moment(selectedEvent.start).format("HH:mm:ss"),
        end_time: moment(selectedEvent.end).format("HH:mm:ss"),
        event_date: moment(selectedEvent.start).format("YYYY-MM-DD"),
      };

      console.log("Updated event data:", updatedEvent);

      const response = await fetch(
        `http://127.0.0.1:5000/calendar/${selectedEvent.event_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to save changes: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Updated event response:", result);

      if (result.message === "Event updated successfully") {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.event_id === selectedEvent.event_id
              ? { ...event, ...updatedEvent }
              : event
          )
        );
      }

      setSelectedEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete event handler
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/calendar/${selectedEvent.event_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete event: ${errorMessage}`);
      }

      const result = await response.json();
      console.log("Deleted event response:", result);

      if (result.message === "Event deleted successfully") {
        setEvents((prevEvents) =>
          prevEvents.filter(
            (event) => event.event_id !== selectedEvent.event_id
          )
        );
      }

      setSelectedEvent(null);
    } catch (err) {
      setError(err.message);
    }
  };





  return (
    <div className="flex mt-10 justify-center h-screen p-5">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center ">Event Calendar</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-md">
            {error}
          </div>
        )}

<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{
    height: 500,
    borderRadius: "20px",
    boxShadow: "10px 4px 8px rgba(0, 0, 0, 0.1)",}}
  eventPropGetter={eventPropGetter}
  onSelectEvent={handleSelectEvent}
/>


        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-5 max-w-sm w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("/goldpaper.jpg")`, // Correctly references the image
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            >
              <h2 className="text-xl font-semibold mb-2">
                Edit Booking for{" "}
                {moment(selectedEvent.start).format("MM/DD/YYYY")}
              </h2>
              <p>Customer: {selectedEvent.customer_id}</p>

              <div className="mb-4">
                <label className="block mb-1">Event Type:</label>
                <input
                  type="text"
                  value={selectedEvent.event_type}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      event_type: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">Event Status:</label>
                <select
                  value={selectedEvent.event_status}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      event_status: e.target.value,
                    })
                  }
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1">Start Time:</label>
                <input
                  type="datetime-local"
                  value={
                    selectedEvent.start
                      ? moment(selectedEvent.start).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    const newStart = new Date(e.target.value);
                    if (!isNaN(newStart)) {
                      setSelectedEvent({
                        ...selectedEvent,
                        start: newStart,
                      });
                    } else {
                      setError("Invalid start time");
                    }
                  }}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1">End Time:</label>
                <input
                  type="datetime-local"
                  value={
                    selectedEvent.end
                      ? moment(selectedEvent.end).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    const newEnd = new Date(e.target.value);
                    if (!isNaN(newEnd)) {
                      setSelectedEvent({
                        ...selectedEvent,
                        end: newEnd,
                      });
                    } else {
                      setError("Invalid end time");
                    }
                  }}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleSave}
                  className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>

                <button
                  onClick={handleDelete}
                  className="mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-200"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
