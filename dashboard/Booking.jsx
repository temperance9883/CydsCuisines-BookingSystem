import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
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
  const [errors, setErrors] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);

  // Fetch bookings when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/bookings") // Fetch bookings from backend
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
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

  // Handle input changes in the form
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


  // Validation logic to prevent overlapping events
  const validateForm = () => {
    let formErrors = {};

    // Check required fields
    if (!formData.requested_date) {
      formErrors.requested_date = "Please select a date.";
    }else if (moment(formData.requested_date).isBefore(moment(), "day")) {
      formErrors.requested_date = "You cannot book events in the past.";
    }


    // Check for required start and end times
  if (!formData.start_time || !formData.end_time) {
    formErrors.time = "Start and end times are required.";
  } else if (formData.end_time <= formData.start_time) {
    formErrors.time = "End time must be later than start time.";
  }

    // Convert input data to date-time objects
    const newStart = moment(
      `${formData.requested_date}T${formData.start_time}`,
      "YYYY-MM-DDTHH:mm"
    );
    const newEnd = moment(
      `${formData.requested_date}T${formData.end_time}`,
      "YYYY-MM-DDTHH:mm"
    );

    // Check for overlaps in existing bookings
    const isOverlapping = bookings.some((booking) => {
      const existingStart = moment(
        `${booking.requested_date}T${booking.start_time}`,
        "YYYY-MM-DDTHH:mm"
      );
      const existingEnd = moment(
        `${booking.requested_date}T${booking.end_time}`,
        "YYYY-MM-DDTHH:mm"
      );

      // Only compare events on the same day
      if (formData.requested_date === booking.requested_date) {
        return (
          (newStart.isBetween(existingStart, existingEnd, undefined, "[)")) || // New start overlaps
          (newEnd.isBetween(existingStart, existingEnd, undefined, "(]")) || // New end overlaps
          (newStart.isSameOrBefore(existingStart) && newEnd.isSameOrAfter(existingEnd)) // New fully encompasses existing
        );
      }
      return false; // No overlap if different day
    });

    if (isOverlapping) {
      formErrors.overlap = "This booking overlaps with an existing one.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
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

    if (!validateForm()) {
      alert("Validation failed. Please fix the errors.");
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

  // Reset the form
  const resetForm = () => {
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
        />
      )}

      <div className="mt-4">
        {bookings.length > 0 ? (
          <BookingCalendar
            events={bookings.map((booking) => ({
              title: `${booking.event_type} - ${booking.customer_id}`,
              start: new Date(booking.start_time),
              end: new Date(booking.end_time),
              bid_status: booking.bid_status,
              booking_id: booking.booking_id,
            }))}
          />
        ) : (
          <p>No bookings available</p>
        )}
      </div>
    </div>
  );
}
