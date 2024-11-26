import React, { useState, useEffect } from "react";

export default function MealPrepBidModal({ onClose, onSaveBid }) {
  const [mealBidId, setMealBidId] = useState("");
  const [bidStatus, setBidStatus] = useState("");
  const [miles, setMiles] = useState("");
  const [serviceFee, setServiceFee] = useState("");
  const [foods, setFoods] = useState("");
  const [estimatedGroceries, setEstimatedGroceries] = useState("");
  const [estimatedBidPrice, setEstimatedBidPrice] = useState("");
  const [supplies, setSupplies] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [customer, setCustomer] = useState("");
  const [customers, setCustomers] = useState([]);
  const [booking, setBooking] = useState([]);

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
        console.log("Bookings fetched: ", bookingData); // Debugging output
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Automatically set createdAt to the current time when the form is submitted
    const createdAt = new Date().toISOString();

    const newBid = {
      meal_bid_id: mealBidId,
      customer_id: customer,
      created_at: createdAt,
      bid_status: bidStatus,
      miles: miles,
      service_fee: serviceFee,
      foods: foods,
      estimated_groceries: estimatedGroceries,
      estimated_bid_price: estimatedBidPrice,
      supplies: supplies,
      booking_id: bookingId,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/meal_prep_bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBid),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bid saved:", data);
        onSaveBid(data); // Optional: Pass saved bid to parent
        onClose(); // Close modal
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
        className="fixed inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl sm:w-11/11 w-1/2"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url("/goldpaper.jpg")`, // Correctly references the image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      >
        <h2 className="text-xl font-semibold mb-4">Meal Prep Bid</h2>
        <form onSubmit={handleSubmit}>
          {/* Add your form fields here */}
          <label className="block mb-2">
            Customer:
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
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
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            >
              <option value="">Select a Booking Event</option>
              {booking.map((item) => (
                <option key={item.booking_id} value={item.booking_id}>
                  {item.event_type}
                </option>
              ))}
            </select>
          </label>
          {/* Removed Created At input */}
          <label className="block mb-2">
            Bid Status:
            <input
              type="text"
              value={bidStatus}
              onChange={(e) => setBidStatus(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Foods:
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Miles:
            <input
              type="number"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Service Fee:
            <input
              type="number"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Supplies:
            <input
              type="text"
              value={supplies}
              onChange={(e) => setSupplies(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Estimated Groceries:
            <input
              type="number"
              value={estimatedGroceries}
              onChange={(e) => setEstimatedGroceries(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <label className="block mb-2">
            Estimated Bid Price:
            <input
              type="number"
              value={estimatedBidPrice}
              onChange={(e) => setEstimatedBidPrice(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              type="submit"
              className="mt-4 bg-amber-500 text-white px-4 py-1 mx-3 rounded-lg hover:bg-amber-300"
            >
              Submit Bid
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 bg-black text-white px-4 py-1 mx-3 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
