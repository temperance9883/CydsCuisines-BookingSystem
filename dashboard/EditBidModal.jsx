import React, { useState, useEffect } from "react";

export default function EditCateringBidModal({ isOpen, onClose, bid, onSave }) {
  const [customer, setCustomer] = useState(bid.customer_id || ""); // Customer ID
  const [bookingId, setBookingId] = useState(bid.booking_id || ""); // Booking ID
  const [cateringBidId, setCateringBidId] = useState(bid.catering_bid_id || ""); // Catering Bid ID
  const [createdAt, setCreatedAt] = useState(bid.created_at || ""); // Created At
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

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedBid = {
      catering_bid_id: cateringBidId,
      customer_id: customer,
      created_at: new Date().toISOString(),
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

  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);
  

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
      }}>

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
              {booking.length > 0 ? (
                booking.map((item) => (
                  <option key={item.booking_id} value={item.booking_id}>
                    {item.event_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading bookings...
                </option>
              )}
            </select>
          </label>

          {/* Additional fields like CleanUp, Decorations */}
          <label className="block mb-2">
            Decorations:
            <input
              type="checkbox"
              checked={decorations}
              onChange={() => setDecorations(!decorations)}
              className="mx-2"
            />
          </label>

          <label className="block mb-2">
            Clean Up:
            <input
              type="checkbox"
              checked={cleanUp}
              onChange={() => setCleanUp(!cleanUp)}
              className="mx-2"
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
            Estimated Bid Price:
            <input
              type="number"
              value={estimatedBidPrice}
              onChange={(e) => setEstimatedBidPrice(e.target.value)}
              className="border border-gray-300 rounded-md p-1 w-full mt-1"
            />
          </label>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="mt-4 bg-black text-white px-4 py-1 mx-3 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="mt-4 bg-amber-500 text-white px-4 py-1 mx-3 rounded-lg hover:bg-amber-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
