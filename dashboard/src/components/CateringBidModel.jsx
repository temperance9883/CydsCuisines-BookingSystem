import React, { useState, useEffect } from "react";

export default function CateringBidModal({ onClose, onSaveBid }) {
  const [customer, setCustomer] = useState(""); // Stores selected customer ID
  const [cateringBidId, setCateringBidId] = useState("");
  const [bidStatus, setBidStatus] = useState("");
  const [miles, setMiles] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [cleanUp, setCleanUp] = useState("");
  const [decorations, setDecorations] = useState("");
  const [foods, setFoods] = useState("");
  const [estimatedGroceries, setEstimatedGroceries] = useState("");
  const [estimatedBidPrice, setEstimatedBidPrice] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState([]);
  const [customers, setCustomers] = useState([]); // State for customers

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/customers");
        const customersData = await response.json();
        console.log("Customers fetched: ", customersData);
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
        console.log("Bookings fetched: ", bookingData);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const calculateBidPrice = () => {
    const milesCharge = miles <= 10 ? 10 : 10 + (miles - 10);
    const decorationCost = decorations ? 60 : 0;
    const cleanUpCost = cleanUp ? 30 : 0;

    const calculatedPrice =
      parseInt(estimatedGroceries || 0, 10) +
      decorationCost +
      cleanUpCost +
      parseInt(serviceFee || 0, 10) +
      milesCharge;

    setEstimatedBidPrice(calculatedPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBid = {
      catering_bid_id: cateringBidId,
      customer_id: customer,
      created_at: new Date().toISOString(), // Set the current timestamp automatically
      bid_status: bidStatus,
      miles: parseInt(miles, 10),
      service_fee: parseInt(serviceFee, 10),
      clean_up: cleanUp,
      decorations: decorations,
      estimated_groceries: parseInt(estimatedGroceries, 10),
      foods,
      estimated_bid_price: parseInt(estimatedBidPrice, 10),
      booking_id: bookingId,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/catering_bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBid),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bid saved:", data);
        onSaveBid(data); // Pass saved bid to parent
        onClose(); // Close modal
        fetchBids(); // Refresh the bid list
      } else {
        const errorData = await response.json();
        console.error("Failed to save bid:", errorData);
      }
    } catch (error) {
      console.error("Error during bid submission:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl sm:w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Catering Bid</h2>
        <form onSubmit={handleSubmit}>
          {/* Customer dropdown */}
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

          {/* Booking event dropdown */}
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

          {/* Removed the Created At input field, as it will be automatically set */}

          {/* Bid Status dropdown */}
          <label className="block mb-2">
            Bid Status:
            <select
              value={bidStatus}
              onChange={(e) => setBidStatus(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            >
              <option value="">Select Bid Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          {/* Miles input */}
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

          {/* Service Fee input */}
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

          {/* Clean Up checkbox */}
          <label className="block mb-2">
            Clean Up:
            <input
              type="number"
              onChange={(e) => setCleanUp(e.target.checked)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          {/* Decorations checkbox */}
          <label className="block mb-2">
            Decorations:
            <input
              type="number"
              onChange={(e) => setDecorations(e.target.checked)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          {/* Foods input */}
          <label className="block mb-2">
            Foods:
            <textarea
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            ></textarea>
          </label>

          {/* Estimated Groceries input */}
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

          {/* Estimated Bid Price input */}
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

          {/* Form Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center mt-4">
            <button
              type="button"
              className="bg-blue-500 text-white rounded-md px-4 py-2 sm:mr-4 mb-2 sm:mb-0"
              onClick={calculateBidPrice}
            >
              Calculate estimated bid
            </button>
            <button
              type="button"
              className="bg-blue-500 text-white rounded-md px-4 py-2 sm:mr-4 mb-2 sm:mb-0"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white rounded-md px-4 py-2"
            >
              Save Bid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
