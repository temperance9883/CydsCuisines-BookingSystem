import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar's styles
import BookingForm from "./BookingForm";
import BookingCalendar from "./calendertest";
import moment from "moment";

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
  const [errors, setErrors] = useState({}); // To track validation errors

  // Fetch bookings when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:5000/bookings") // Fetch bookings from backend
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error))
      .finally(() => setLoading(false));
  }, []);

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
      alert("Please provide a valid time.");
      return null;
    }

    const date = new Date(dateString);
    const [hours, minutes] = timeString.split(":");

    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return date.toISOString(); // Return in ISO string format
  }

  // Function to check if the new booking overlaps with existing ones
  const validateForm = () => {
    let formErrors = {};

    // Check required fields
    if (!formData.requested_date) {
      formErrors.requested_date = "Please select a date.";
    }
    if (formData.end_time <= formData.start_time) {
      formErrors.time = "End time must be later than start time.";
    }

    // Convert input data to comparable date-time objects
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

      // Overlap conditions
      return (
        formData.requested_date === booking.requested_date && // Same day
        (
          (newStart.isBetween(existingStart, existingEnd, undefined, "[)")) || // New start overlaps
          (newEnd.isBetween(existingStart, existingEnd, undefined, "(]")) || // New end overlaps
          (newStart.isSameOrBefore(existingStart) && newEnd.isSameOrAfter(existingEnd)) // New fully encompasses existing
        )
      );
    });

    if (isOverlapping) {
      formErrors.overlap = "This booking overlaps with an existing one.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Validation failed. Please check the errors.");
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
            onSelectEvent={(event) =>
              setFormData({
                requested_date: event.requested_date,
                start_time: event.start,
                end_time: event.end,
              })
            }
          />
        ) : (
          <p>No bookings available</p>
        )}
      </div>
    </div>
  );
}
