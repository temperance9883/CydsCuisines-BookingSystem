import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar's styles
import BookingForm from "./BookingForm";
import BookingCalendar from "./calendertest";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [formData, setFormData] = useState({
    requested_date: "",
    event_location: "",
    event_type: "",
    customer_id: "",
    number_of_guests: "",
    bid_status: "Pending",
    user_id: "",
    service_type: "",
    start_time: "",
    end_time: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  // Function to fetch bookings
  const fetchBookings = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5000/bookings")
      .then((response) => {
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
          start_time: new Date(booking.start_time),
          end_time: new Date(booking.end_time),
        }));
        setBookings(formattedBookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  };

  // Reload the calendar when bookings change
  useEffect(() => {
    // React will automatically re-render when `bookings` state changes
  }, [bookings]);

  // Handle form data input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  function combineDateAndTime(dateString, timeString) {
    if (!timeString) {
      console.error("Time string is undefined or empty");
      return null;
    }

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(":");
    const period = timeString.toLowerCase().includes("pm") ? "pm" : "am";

    const isPM = period === "pm";
    let hour = parseInt(hours, 10);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour -= 12;

    date.setHours(hour);
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  // Function to check if the new booking overlaps with existing ones
  const isOverlapping = (startTime, endTime) => {
    return bookings.some(
      (booking) =>
        startTime < new Date(booking.end_time) &&
        endTime > new Date(booking.start_time)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.start_time || !formData.end_time) {
      console.error("Start time or end time is missing");
      return;
    }

    const combinedStartTime = combineDateAndTime(
      formData.requested_date,
      formData.start_time
    );
    const combinedEndTime = combineDateAndTime(
      formData.requested_date,
      formData.end_time
    );

    if (!combinedStartTime || !combinedEndTime) {
      console.error("Failed to combine date and time.");
      return;
    }

    // Log the existing bookings and the times to debug
    console.log("Fetched events:", bookings);
    console.log(
      "New booking start:",
      combinedStartTime,
      "end:",
      combinedEndTime
    );

    // Check for overlap
    const isOverlapping = bookings.some((booking) => {
      const existingStart = new Date(booking.start_time); // Make sure this is a Date object
      const existingEnd = new Date(booking.end_time); // Make sure this is a Date object

      // Log to debug the time comparisons
      console.log("Comparing to existing booking:", existingStart, existingEnd);

      // Check if the new booking overlaps with any existing booking
      return (
        new Date(combinedStartTime) < existingEnd &&
        new Date(combinedEndTime) > existingStart
      );
    });

    if (isOverlapping) {
      alert(
        "This booking overlaps with an existing one. Please choose a different time."
      );
      return; // Do not submit the booking if there is an overlap
    }

    const formattedData = {
      ...formData,
      start_time: combinedStartTime,
      end_time: combinedEndTime,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/bookings",
        formattedData
      );
      setBookings((prevBookings) => [...prevBookings, response.data]);
      setFormData({
        requested_date: "",
        event_location: "",
        event_type: "",
        customer_id: "",
        number_of_guests: "",
        bid_status: "Pending",
        user_id: "",
        service_type: "",
        start_time: "",
        end_time: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  // Combine date and time function
  function combineDateAndTime(dateString, timeString) {
    if (!timeString) {
      console.error("Time string is undefined or empty");
      return null;
    }

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(":");
    const period = timeString.toLowerCase().includes("pm") ? "pm" : "am";

    const isPM = period === "pm";
    let hour = parseInt(hours, 10);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour -= 12;

    date.setHours(hour);
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  // Handle editing a booking
  const handleEdit = (booking) => {
    setFormData({ ...booking });
    setEditingBooking(booking.booking_id);
    setShowForm(true);
  };

  // Handle deleting a booking
  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`);
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.booking_id !== bookingId)
      );
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking.");
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-10 rounded float-right"
        onClick={() => setShowForm(true)}
      >
        Add Booking
      </button>

      {showForm && (
        <BookingForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
          setBookings={setBookings}
          editingBooking={editingBooking}
        />
      )}

      <div className="mt-4">
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length > 0 ? (
          <BookingCalendar
            events={bookings.map((booking) => ({
              title: `${booking.event_type} - ${booking.customer_id}`,
              start: new Date(booking.start_time),
              end: new Date(booking.end_time),
              bid_status: booking.bid_status,
              booking_id: booking.booking_id,
            }))}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleEdit}
            style={{ height: 500 }}
            eventPropGetter={(event) => ({
              onClick: () => handleEdit(event),
            })}
          />
        ) : (
          <p>No bookings available</p>
        )}
      </div>
    </div>
  );
}
