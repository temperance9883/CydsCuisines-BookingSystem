import React, { useState, useEffect } from "react";

const BidSelection = () => {
  const [bids, setBids] = useState([]);
  const [selectedBidType, setSelectedBidType] = useState("mealPrep"); // Default to MealPrepBid

  useEffect(() => {
    // Fetch bids from your API
    const fetchBids = async () => {
      const response = await fetch("/api/bids"); // Update this with your actual API endpoint
      const data = await response.json();
      setBids(data);
    };

    fetchBids();
  }, []);

  const handleBidTypeChange = (event) => {
    setSelectedBidType(event.target.value);
  };

  const filteredBids = bids.filter((bid) =>
    selectedBidType === "mealPrep"
      ? bid.bid_id && !bid.catering_bid_id
      : bid.catering_bid_id
  );

  return (
    <div>
      <h1>Select a Bid Type</h1>
      <div>
        <label>
          <input
            type="radio"
            value="mealPrep"
            checked={selectedBidType === "mealPrep"}
            onChange={handleBidTypeChange}
          />
          Meal Prep Bid
        </label>
        <label>
          <input
            type="radio"
            value="catering"
            checked={selectedBidType === "catering"}
            onChange={handleBidTypeChange}
          />
          Catering Bid
        </label>
      </div>

      <h2>Bids</h2>
      <ul>
        {filteredBids.map((bid) => (
          <li key={bid.bid_id}>
            {selectedBidType === "mealPrep"
              ? `Meal Bid ID: ${bid.bid_id}`
              : `Catering Bid ID: ${bid.bid_id}`}
            <p>Status: {bid.bid_status}</p>
            <p>
              Requested Date:{" "}
              {new Date(bid.requested_date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidSelection;
