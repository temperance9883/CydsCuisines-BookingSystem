import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  setBookings,
}) => {
  const [customers, setCustomers] = useState([]);

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
  }, []);

  const handleClose = () => {
    setShowForm(false); // Close the form
    resetForm(); // Reset the form data
  };
  

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-70">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4 md:mx-0 overflow-y-auto max-h-[90vh]"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("/goldpaper.jpg")`, // Correctly references the image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      >
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
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>

            <button
              type="submit"
              className="mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-300"
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