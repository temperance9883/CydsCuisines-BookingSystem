import React, { useState, useEffect } from "react";

export default function EditCateringBidModal({ isOpen, onClose, bid, onSave }) {
  const [customer, setCustomer] = useState(bid.customer_id || ""); // Customer ID
  const [bookingId, setBookingId] = useState(bid.booking_id || ""); // Booking ID
  const [cateringBidId, setCateringBidId] = useState(bid.catering_bid_id || ""); // Catering Bid ID
  const [createdAt, setCreatedAt] = useState(bid.created_at || ""); // Created At
  const [bidStatus, setBidStatus] = useState(bid.bid_status || ""); // Bid Status
  const [miles, setMiles] = useState(bid.miles || ""); // Miles
  const [serviceFee, setServiceFee] = useState(bid.service_fee || ""); // Service Fee
  const [cleanUp, setCleanUp] = useState(bid.clean_up || ""); // Clean Up
  const [decorations, setDecorations] = useState(bid.decorations || ""); // Decorations
  const [foods, setFoods] = useState(bid.foods || ""); // Foods
  const [estimatedGroceries, setEstimatedGroceries] = useState(
    bid.estimated_groceries || ""
  ); // Estimated Groceries
  const [estimatedBidPrice, setEstimatedBidPrice] = useState(
    bid.estimated_bid_price || ""
  ); // Estimated Bid Price

  const [customers, setCustomers] = useState([]); // State for customers
  const [booking, setBooking] = useState([]); // State for bookings

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/customers");
        const customersData = await response.json();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();

    const fetchBookings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/bookings");
        const bookingData = await response.json();
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const calculateBidPrice = () => {
    // Miles calculation
    const milesCharge = miles <= 10 ? 10 : 10 + (miles - 10);

    // Catering-specific logic for decorations and cleanup costs
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

  const handleSave = () => {
    const updatedBid = {
      catering_bid_id: cateringBidId,
      customer_id: customer,
      created_at: new Date().toISOString(),
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
    onSave(updatedBid);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl sm:w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold mb-4">Edit Catering Bid</h2>
        <form>
          {/* Customer dropdown */}
          <label className="block mb-2">
            Customer:
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
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
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            >
              <option value="">Select a Booking Event</option>
              {booking.map((item) => (
                <option key={item.booking_id} value={item.booking_id}>
                  {item.event_name}
                </option>
              ))}
            </select>
          </label>

          {/* Additional fields like CleanUp, Decorations */}
          <label className="block mb-2">
            Decorations:
            <input
              type="checkbox"
              checked={decorations}
              onChange={() => setDecorations(!decorations)}
              className="mt-1"
            />
          </label>

          <label className="block mb-2">
            Clean Up:
            <input
              type="checkbox"
              checked={cleanUp}
              onChange={() => setCleanUp(!cleanUp)}
              className="mt-1"
            />
          </label>

          {/* Service Fee and other fields */}
          <label className="block mb-2">
            Service Fee:
            <input
              type="number"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Miles:
            <input
              type="number"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Estimated Groceries:
            <input
              type="number"
              value={estimatedGroceries}
              onChange={(e) => setEstimatedGroceries(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Foods:
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          <label className="block mb-2">
            Bid Status:
            <select
              value={bidStatus}
              onChange={(e) => setBidStatus(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <label className="block mb-2">
            Estimated Bid Price:
            <input
              type="number"
              value={estimatedBidPrice}
              onChange={(e) => setEstimatedBidPrice(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 rounded px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white rounded px-4 py-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
