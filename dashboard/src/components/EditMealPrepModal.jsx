import React, { useState, useEffect } from "react";

export default function EditMealPrepBidModal({ onClose, onSaveBid, bid }) {
  const [mealBidId, setMealBidId] = useState(bid.meal_bid_id || "");
  const [bidStatus, setBidStatus] = useState(bid.bid_status || "");
  const [miles, setMiles] = useState(bid.miles || "");
  const [serviceFee, setServiceFee] = useState(bid.service_fee || "");
  const [foods, setFoods] = useState(bid.foods || "");
  const [estimatedGroceries, setEstimatedGroceries] = useState(
    bid.estimated_groceries || ""
  );
  const [estimatedBidPrice, setEstimatedBidPrice] = useState(
    bid.estimated_bid_price || ""
  );
  const [supplies, setSupplies] = useState(bid.supplies || "");
  const [bookingId, setBookingId] = useState(bid.booking_id || "");
  const [customer, setCustomer] = useState(bid.customer_id || ""); // Directly use the provided `customer`

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const createdAt = new Date().toISOString();

    console.log("Booking object:", booking);

    // Find the booking object that matches the bookingId
    const selectedBooking = booking.find((b) => b.booking_id === bookingId);

    if (!selectedBooking) {
      console.error("No matching booking found for bookingId:", bookingId);
      return; // Exit early if no match is found
    }

    console.log("Selected booking:", selectedBooking);

    // Validate start_time and end_time
    if (
      selectedBooking.start_time !== booking?.start_time ||
      selectedBooking.end_time !== booking?.end_time
    ) {
      console.error(
        `Mismatch in times! Start or End time does not match for bookingId: ${bookingId}`
      );
      return; // Exit early if times do not match
    }

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
      start_time: booking?.start_time, // Use the existing start_time from booking
      end_time: booking?.end_time, // Use the existing end_time from booking
    };

    console.log("Sending bid data:", newBid);

    try {
      let response;
      if (mealBidId) {
        console.log("Updating bid with ID:", mealBidId);

        response = await fetch(
          `http://127.0.0.1:5000/meal_prep_bids/${mealBidId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newBid),
          }
        );
      } else {
        console.log("Creating new bid");

        response = await fetch("http://127.0.0.1:5000/meal_prep_bids", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBid),
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log("Bid saved or updated:", data);

        const eventId = data.booking_id;
        console.log("Event ID for calendar update:", eventId);

        if (eventId) {
          const calendarData = {
            event_status: bidStatus,
            event_type: booking?.event_type || selectedBooking.event_type,
            event_date: booking?.event_date || selectedBooking.event_date, // Ensure event_date is included
            start_time: booking?.start_time,
            end_time: booking?.end_time,
          };

          console.log("Updating calendar event with data:", calendarData);

          const calendarResponse = await fetch(
            `http://127.0.0.1:5000/calendar/${eventId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(calendarData),
            }
          );

          if (calendarResponse.ok) {
            console.log("Calendar event updated successfully.");
          } else {
            console.error("Error updating calendar event.");
          }
        }

        onSaveBid(data);
        onClose();
      } else {
        console.error("Error saving or updating bid");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-4xl mx-4 sm:mx-8 md:mx-12">
        <h2 className="text-xl font-semibold mb-4">Edit Meal Prep Bid</h2>
        <form onSubmit={handleSubmit}>
          {/* Removed created_at input field */}
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
          {/* <label className="block mb-2">
            Booking Event:
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1"
            />
          </label> */}
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              Update Bid
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
