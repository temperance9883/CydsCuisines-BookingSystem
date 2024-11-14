import React, { useState, useEffect } from "react";
import CateringBidModal from "./CateringBidModel";
import MealPrepBidModal from "./MealPrepBidModel";
import GenerateContract from "./GenerateContract";
import EditBidModal from "./EditBidModal.jsx";

const BidTable = ({ bids, type, onSelectBid, customers, onEditBid }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4 text-gray-700">{`${type} Bids`}</h2>
    <div className="overflow-auto bg-white rounded-lg shadow">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Assign Client</th>
            <th className="py-3 px-6 text-left">Miles</th>
            <th className="py-3 px-6 text-left">Service Fee</th>
            <th className="py-3 px-6 text-left">Estimated Groceries</th>
            <th className="py-3 px-6 text-left">Bid Status</th>
            <th className="py-3 px-6 text-left">Estimated Bid Price</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {bids.map((bid) => (
            <tr
              key={type === "Catering" ? bid.catering_bid_id : bid.meal_bid_id}
              className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => onEditBid(bid)} // Trigger modal on row click
            >
              <td className="py-3 px-6">
                <select
                  value={bid.customer_id || ""}
                  onChange={(e) => onSelectBid(bid, e.target.value)}
                  className="border rounded px-2 py-1"
                  onClick={(e) => e.stopPropagation()} // Prevent click from propagating to row
                >
                  <option value="">Select Client</option>
                  {customers.map((customer) => (
                    <option
                      key={customer.customer_id}
                      value={customer.customer_id}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-6">{bid.miles}</td>
              <td className="py-3 px-6">${bid.service_fee}</td>
              <td className="py-3 px-6">${bid.estimated_groceries}</td>
              <td className="py-3 px-6">{bid.bid_status}</td>
              <td className="py-3 px-6">${bid.estimated_bid_price}</td>
              <td className="py-3 px-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to row
                    GenerateContract(bid);
                  }}
                >
                  Create Contract
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function BidComponent() {
  const [cateringBids, setCateringBids] = useState([]);
  const [mealPrepBids, setMealPrepBids] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isCateringModalOpen, setIsCateringModalOpen] = useState(false);
  const [isMealPrepModalOpen, setIsMealPrepModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Declare state for modal visibility

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

    const fetchBids = async () => {
      try {
        const responseCatering = await fetch(
          "http://127.0.0.1:5000/catering_bids"
        );
        const cateringData = await responseCatering.json();
        console.log("Catering Bids fetched: ", cateringData); // Debugging output
        setCateringBids(cateringData);

        const responseMealPrep = await fetch(
          "http://127.0.0.1:5000/meal_prep_bids"
        );
        const mealPrepData = await responseMealPrep.json();
        console.log("Meal Prep Bids fetched: ", mealPrepData); // Debugging output
        setMealPrepBids(mealPrepData);
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    };

    fetchCustomers();
    fetchBids();
  }, []);

  const handleSelectBid = async (bid, customerId) => {
    console.log("Bid selected: ", bid); // Debugging output
    if (!customerId) {
      alert("Please select a client for this bid.");
      return;
    }

    const updatedBid = {
      ...bid,
      customer_id: customerId,
    };

    const url = `http://127.0.0.1:5000/${
      bid.bid_type === "Catering" ? "catering_bids" : "mealprep_bids"
    }/${bid.bid_id}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBid),
      });

      if (response.ok) {
        alert("Bid updated successfully!");
        fetchBids();
      } else {
        alert("Error updating the bid.");
      }
    } catch (error) {
      console.error("Error updating the bid:", error);
      alert("Error updating the bid.");
    }
  };

  const handleEditBid = (bid) => {
    console.log("Opening edit modal for bid: ", bid); // Debugging output
    setSelectedBid(bid);
    setIsEditModalOpen(true);
    setIsModalOpen(true); // Open the modal
  };

  const handleSaveBid = async (updatedBid) => {
    console.log("Saving bid: ", updatedBid); // Debugging output
    // Logic to save the updated bid
    setIsEditModalOpen(false);
    fetchBids();
  };

  const handleBidSave = async (newBid, bidType) => {
    console.log("Saving new bid: ", newBid); // Debugging output

    // Construct the URL for the appropriate bid type
    const url =
      bidType === "catering"
        ? "http://127.0.0.1:5000/catering_bids"
        : "http://127.0.0.1:5000/meal_prep_bids";

    try {
      const response = await fetch(url, {
        method: "POST", // Assuming POST to create a new bid
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBid),
      });

      if (response.ok) {
        alert("Bid saved successfully!");
        fetchBids(); // Refresh the bids after saving
      } else {
        alert("Error saving the bid.");
      }
    } catch (error) {
      console.error("Error saving the bid:", error);
      alert("Error saving the bid.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Bids Management</h1>

      <div className="mb-6">
        <button
          onClick={() => setIsCateringModalOpen(true)}
          className="bg-green-600 text-white rounded-md px-4 py-2 mr-4 hover:bg-green-700"
        >
          Create Catering Bid
        </button>
        <button
          onClick={() => setIsMealPrepModalOpen(true)}
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
        >
          Create Meal Prep Bid
        </button>
      </div>

      {isCateringModalOpen && (
        <CateringBidModal
          onClose={() => setIsCateringModalOpen(false)}
          onSave={(newBid) => handleBidSave(newBid, "catering")}
        />
      )}

      {isMealPrepModalOpen && (
        <MealPrepBidModal
          onClose={() => setIsMealPrepModalOpen(false)}
          onSave={(newBid) => handleBidSave(newBid, "meal_prep")}
        />
      )}

      {/* Render the EditBidModal when isEditModalOpen is true */}
      {isEditModalOpen && selectedBid && (
        <EditBidModal
          isOpen={isModalOpen}
          bid={selectedBid}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveBid}
        />
      )}

      <BidTable
        bids={cateringBids}
        type="Catering"
        onSelectBid={handleSelectBid}
        customers={customers}
        onEditBid={handleEditBid}
      />
      <BidTable
        bids={mealPrepBids}
        type="Meal Prep"
        onSelectBid={handleSelectBid}
        customers={customers}
        onEditBid={handleEditBid}
      />
    </div>
  );
}
