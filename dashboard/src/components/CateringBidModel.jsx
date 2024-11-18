import React, { useState, useEffect } from "react";

export default function CateringBidModal({ onClose, onSave }) {
  const [customer, setCustomer] = useState("");
  const [cateringBidId, setCateringBidId] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [bidStatus, setBidStatus] = useState("");
  const [miles, setMiles] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [cleanUp, setCleanUp] = useState("");
  const [decorations, setDecorations] = useState("");
  const [foods, setFoods] = useState("");
  const [estimatedGroceries, setEstimatedGroceries] = useState("");
  const [estimatedBidPrice, setEstimatedBidPrice] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState([]); // Initialize booking as an empty array
  const [customers, setCustomers] = useState([]); // Added state for customers

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/customers");
        const customersData = await response.json();
        console.log("Customers fetched: ", customersData); // Debugging output
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/bookings");
        const bookingData = await response.json();
        console.log("Bookings fetched: ", bookingData); // Debugging output
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newBid = {
      catering_bid_id: cateringBidId,
      customer_id: customer, // Include customer ID in your bid data
      created_at: createdAt,
      bid_status: bidStatus,
      miles: miles,
      service_fee: serviceFee,
      clean_up: cleanUp,
      decorations: decorations,
      estimated_groceries: estimatedGroceries,
      booking_id: bookingId,
      foods,
      estimated_bid_price,
    };
    onSave(newBid); // Call the save function passed from parent
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-1/3">
        <h2 className="text-xl font-semibold mb-4">Catering Bid</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Customer:
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            >
              <option value="">Select a Customer</option>
              {customers.map((customer) => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            Booking Event:
            <select
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            >
              <option value="">Select a Booking Event</option>
              {booking.map((item) => (
                <option key={item.booking_id} value={item.booking_id}>
                  {item.event_type}
                </option>
              ))}
            </select>
          </label>
          {/* Other form fields */}
          <label className="block mb-2">
            Created At:
            <input
              type="datetime-local"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Bid Status:
            <input
              type="text"
              value={bidStatus}
              onChange={(e) => setBidStatus(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Foods:
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Miles:
            <input
              type="number"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Service Fee:
            <input
              type="number"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Clean Up:
            <input
              type="text"
              value={cleanUp}
              onChange={(e) => setCleanUp(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Decorations:
            <input
              type="text"
              value={decorations}
              onChange={(e) => setDecorations(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Estimated Groceries:
            <input
              type="number"
              value={estimatedGroceries}
              onChange={(e) => setEstimatedGroceries(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Estimated Bid Price:
            <input
              type="number"
              value={estimatedBidPrice}
              onChange={(e) => setEstimatedBidPrice(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-600 mr-5"
            >
              Calculate Bid Price
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2 hover:bg-blue-600 mr-5"
            >
              Submit Bid
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black rounded-md px-4 py-2 hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
