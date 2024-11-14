import React, { useState, useEffect } from "react";

const EditBidModal = ({ isOpen, onClose, bid, onSave }) => {
  // Local state to store the form values
  const [client, setClient] = useState(bid.client || "Select Client");
  const [miles, setMiles] = useState(bid.miles || 0);
  const [serviceFee, setServiceFee] = useState(bid.service_fee || 0);
  const [estimatedGroceries, setEstimatedGroceries] = useState(
    bid.estimated_groceries || 0
  );
  const [bidStatus, setBidStatus] = useState(bid.bid_status || "pending");
  const [estimatedBidPrice, setEstimatedBidPrice] = useState(
    bid.estimated_bid_price || 0
  );

  // Additional fields
  const [menu, setMenu] = useState(bid.menu || "");
  const [numberOfGuests, setNumberOfGuests] = useState(
    bid.number_of_guests || 0
  );
  const [eventDate, setEventDate] = useState(bid.event_date || "");

  // Sync state with the incoming bid prop when it changes
  useEffect(() => {
    if (bid) {
      setClient(bid.client || "Select Client");
      setMiles(bid.miles || 0);
      setServiceFee(bid.service_fee || 0);
      setEstimatedGroceries(bid.estimated_groceries || 0);
      setBidStatus(bid.bid_status || "pending");
      setEstimatedBidPrice(bid.estimated_bid_price || 0);
      setMenu(bid.menu || "");
      setNumberOfGuests(bid.number_of_guests || 0);
      setEventDate(bid.event_date || "");
    }
  }, [bid]);

  const handleSave = () => {
    const updatedBid = {
      ...bid,
      client,
      miles,
      service_fee: serviceFee,
      estimated_groceries: estimatedGroceries,
      bid_status: bidStatus,
      estimated_bid_price: estimatedBidPrice,
      menu,
      number_of_guests: numberOfGuests,
      event_date: eventDate,
    };
    onSave(updatedBid);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Bid</h2>
        {/* Assign Client Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Assign Client
          </label>
          <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="Select Client">Select Client</option>
            {/* Populate with real client options */}
            <option value="Client 1">Client 1</option>
            <option value="Client 2">Client 2</option>
            <option value="Client 3">Client 3</option>
          </select>
        </div>

        {/* Additional Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Menu
          </label>
          <input
            type="text"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Number of Guests
          </label>
          <input
            type="number"
            value={numberOfGuests}
            onChange={(e) => setNumberOfGuests(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Event Date
          </label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Original Fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Miles
          </label>
          <input
            type="number"
            value={miles}
            onChange={(e) => setMiles(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Service Fee
          </label>
          <input
            type="number"
            value={serviceFee}
            onChange={(e) => setServiceFee(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Groceries
          </label>
          <input
            type="number"
            value={estimatedGroceries}
            onChange={(e) => setEstimatedGroceries(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Bid Status
          </label>
          <select
            value={bidStatus}
            onChange={(e) => setBidStatus(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Estimated Bid Price
          </label>
          <input
            type="number"
            value={estimatedBidPrice}
            onChange={(e) => setEstimatedBidPrice(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 rounded px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white rounded px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBidModal;
