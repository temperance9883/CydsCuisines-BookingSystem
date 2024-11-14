import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar's styles
import BookingForm from "./BookingForm";
import BookingCalendar from "./calendertest";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Function to fetch bookings
  const fetchBookings = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:5000/bookings")
      .then((response) => {
        const formattedBookings = response.data.map((booking) => ({
          ...booking,
          start_time: new Date(booking.start_time), // Ensure start_time is a Date object
          end_time: new Date(booking.end_time), // Ensure end_time is a Date object
        }));
        setBookings(formattedBookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  };

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    const formattedData = {
      ...formData,
      start_time: combinedStartTime,
      end_time: combinedEndTime,
    };

    try {
      await axios.post("http://localhost:5000/bookings", formattedData);
      fetchBookings(); // Refresh bookings after posting
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
      fetchBookings(); // Refresh bookings after deletion
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
        />
      )}

      <div className="mt-4">
        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <BookingCalendar
            events={bookings.map((booking) => ({
              title: booking.event_type,
              start: new Date(booking.start_time),
              end: new Date(booking.end_time),
              booking_id: booking.booking_id,
            }))}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={(event) =>
              handleEdit(
                bookings.find((b) => b.booking_id === event.booking_id)
              )
            }
            style={{ height: 500 }}
          />
        )}
      </div>
    </div>
  );
}
