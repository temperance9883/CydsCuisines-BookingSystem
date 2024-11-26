import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const BookingForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  setBookings,
}) => {
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookingsState] = useState([]); // State to hold existing bookings
  const [errors, setErrors] = useState({}); // For handling errors
  

  // Fetch customers from API
  useEffect(() => {
    axios
      .get("http://localhost:5000/customers") // Adjust endpoint based on your API
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });

    // Fetch bookings from API
    axios
      .get("http://localhost:5000/bookings") // Adjust endpoint for bookings API
      .then((response) => {
        setBookingsState(response.data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, []);

  const handleClose = () => {
    setShowForm(false);
    setBookings([]); // Optional: Reset bookings if desired
  };

  const validateForm = () => {
    let formErrors = {};
  
    // Check required fields
    if (!formData.requested_date_from) {
      formErrors.requested_date = "Please select a date.";
    }
    if (formData.end_time <= formData.start_time) {
      formErrors.time = "End time must be later than start time.";
    }
  
    // Convert input data to comparable date-time objects
    const newStart = moment(
      `${formData.requested_date_from}T${formData.start_time}`,
      "YYYY-MM-DDTHH:mm"
    );
    const newEnd = moment(
      `${formData.requested_date_from}T${formData.end_time}`,
      "YYYY-MM-DDTHH:mm"
    );
  
    // Check for overlaps in existing bookings
    const isOverlapping = bookings.some((booking) => {
      const existingStart = moment(
        `${booking.requested_date_from}T${booking.start_time}`,
        "YYYY-MM-DDTHH:mm"
      );
      const existingEnd = moment(
        `${booking.requested_date_from}T${booking.end_time}`,
        "YYYY-MM-DDTHH:mm"
      );
  
      // Overlap conditions
      return (
        formData.requested_date_from === booking.requested_date_from && // Same day
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
  
  

  const handleSubmitWithValidation = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
  
    if (validateForm()) {
      try {
        console.log("Submitting form data:", formData); // Debugging
        const response = await axios.post("http://localhost:5000/calendar", formData);
  
        if (response.status === 201) {
          alert("Booking added successfully!");
          setShowForm(false); // Close form
          setBookings((prev) => [...prev, response.data]); // Update bookings
        } else {
          alert("Failed to add booking.");
        }
      } catch (error) {
        console.error("Error during submission:", error.response || error.message);
        alert("An error occurred while submitting the form. Please try again.");
      }
    } else {
      console.log("Form validation failed:", errors); // Debugging
    }
  };
  
  

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4 md:mx-0 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {formData.booking_id ? "Edit Booking" : "Create Booking"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="requested_date" className="mb-1 font-medium">
                Requested Date
              </label>
              <input
                type="date"
                id="requested_date"
                name="requested_date"
                value={formData.requested_date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="event_location" className="mb-1 font-medium">
                Event Location
              </label>
              <input
                type="text"
                id="event_location"
                name="event_location"
                value={formData.event_location}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="event_type" className="mb-1 font-medium">
                Event Title
              </label>
              <input
                type="text"
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="customer_id" className="mb-1 font-medium">
                Customer
              </label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option
                    key={customer.customer_id}
                    value={customer.customer_id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="number_of_guests" className="mb-1 font-medium">
                Number of Guests
              </label>
              <input
                type="number"
                id="number_of_guests"
                name="number_of_guests"
                value={formData.number_of_guests}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="bid_status" className="mb-1 font-medium">
                Bid Status
              </label>
              <select
                id="bid_status"
                name="bid_status"
                value={formData.bid_status}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="service_type" className="mb-1 font-medium">
                Service Type
              </label>
              <select
                id="service_type"
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              >
                <option value="">Select Service Type</option>
                <option value="Meal_Prep">Meal Prep</option>
                <option value="Catering">Catering</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="user_id" className="mb-1 font-medium">
                User ID
              </label>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="start_time" className="mb-1 font-medium">
                Start Time
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end_time" className="mb-1 font-medium">
                End Time
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-blue-400"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;