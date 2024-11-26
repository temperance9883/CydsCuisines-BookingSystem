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
        const formattedBookings = response.data.map((booking) => {
          // Get today's date in YYYY-MM-DD format
          const today = new Date().toISOString().split("T")[0];

          // Combine the date with the time from the backend
          const start_time = new Date(`${today}T${booking.start_time}`);
          const end_time = new Date(`${today}T${booking.end_time}`);

          return { ...booking, start_time, end_time };
        });
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

  // Combine date and time into an ISO string
  function combineDateAndTime(dateString, timeString) {
    if (!timeString) {
      console.error("Time string is undefined or empty");
      alert("Please provide a valid time.");
      return null;
    }

    const date = new Date(dateString); // Create date from input date string
    const [hours, minutes] = timeString.split(":");

    let hour = parseInt(hours, 10);
    let minute = parseInt(minutes, 10);

    const isPM = timeString.toLowerCase().includes("pm");
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour -= 12;

    date.setUTCHours(hour); // Set hours in UTC
    date.setUTCMinutes(minute); // Set minutes in UTC
    date.setUTCSeconds(0); // Reset seconds

    return date.toISOString(); // Return in ISO string format (UTC)
  }

  // Function to check if the new booking overlaps with existing ones
  // Function to check if the new booking overlaps with existing ones
  const isOverlapping = (newStartTime, newEndTime, bookings) => {
    const newStart = new Date(newStartTime);
    const newEnd = new Date(newEndTime);

    return bookings.some((booking) => {
      const existingStart = new Date(booking.start_time);
      const existingEnd = new Date(booking.end_time);

      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { requested_date, start_time, end_time } = formData;

    // Validate input
    if (!requested_date || !start_time || !end_time) {
      alert("Please fill out all required fields.");
      return;
    }

    const combinedStartTime = combineDateAndTime(requested_date, start_time);
    const combinedEndTime = combineDateAndTime(requested_date, end_time);

    if (!combinedStartTime || !combinedEndTime) {
      return;
    }

    if (isOverlapping(combinedStartTime, combinedEndTime, bookings)) {
      alert(
        "This booking overlaps with an existing booking. Please choose a different time."
      );
      return;
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
      resetForm();
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  // Function to handle updating a booking status (Pending, Confirmed, Completed)
  const updateCalendar = async (bookingId, newStatus) => {
    try {
      // Update the booking status on the backend
      const updatedBooking = await axios.put(
        `http://localhost:5000/bookings/${bookingId}`,
        { bid_status: newStatus }
      );

      // Update the bookings state to reflect the new status
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId
            ? { ...booking, bid_status: newStatus }
            : booking
        )
      );
      alert(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status.");
    }
  };

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

  // Reset form function
  function resetForm() {
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
  }

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
