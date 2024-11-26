import React, { useState, useEffect } from "react";
import CateringBidModal from "./CateringBidModel";
import MealPrepBidModal from "./MealPrepBidModel";
import GenerateContract from "./GenerateContract";
import EditCateringBidModal from "./EditBidModal.jsx";
import EditMealPrepBidModal from "./EditMealPrepModal.jsx";
const BidTable = ({
  bids,
  type,
  onSelectBid,
  customers,
  onEditBid,
  onCreateContract,
  setIsCateringModalOpen,
  setIsMealPrepModalOpen,
  onClose,
  onSaveBid,
}) => (
  <div className="bid-section mb-8 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold mb-4">{`${type} Bids`}</h2>
    <div className="overflow-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-black text-white text-sm ">
          <th className="py-3 px-6 text-center">Assign Client</th>
            <th className="py-3 px-6 text-center">Food</th>
            <th className="py-3 px-6 text-center">Estimated Bid Price</th>
            <th className="py-3 px-6 text- text-center">Generate Contract</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr
              key={type === "Catering" ? bid.catering_bid_id : bid.meal_bid_id}
              className="border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
              onClick={() => onEditBid(bid)} // Trigger modal on row click
            >
              <td className="py-3 px-6 text-center">
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
              <td className="py-3 px-6 text-center">{bid.foods}</td>
              <td className="py-3 px-6 text-center ">${bid.estimated_bid_price}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to row
                    onCreateContract(bid); // Trigger the contract modal
                  }}
                  className="mt-4 bg-emerald-300 text-white px-4 py-2 rounded hover:bg-amber-300"
                >
                  Create Contract
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conditional Buttons at the bottom */}
      <div className="flex justify-end gap-4 mt-4 w-full ">
        {type === "Catering" && (
          <button
            onClick={() => setIsCateringModalOpen(true)}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Create Catering Bid
          </button>
        )}
        {type === "Meal Prep" && (
          <button
            onClick={() => setIsMealPrepModalOpen(true)}
            className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Create Meal Prep Bid
          </button>
        )}
      </div>
    </div>
  </div>
);

export default function BidComponent() {
  const [cateringBids, setCateringBids] = useState([]);
  const [mealPrepBids, setMealPrepBids] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isCateringModalOpen, setIsCateringModalOpen] = useState(false);
  const [isMealPrepModalOpen, setIsMealPrepModalOpen] = useState(false);
  const [isEditCateringModalOpen, setIsEditCateringModalOpen] = useState(false);
  const [isEditMealPrepModalOpen, setIsEditMealPrepModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [bids, setBids] = useState([]);

  // Fetch bids function moved here
  const fetchBids = async () => {
    try {
      const responseCatering = await fetch(
        "http://127.0.0.1:5000/catering_bids"
      );
      const cateringData = await responseCatering.json();
      setCateringBids(cateringData);

      const responseMealPrep = await fetch(
        "http://127.0.0.1:5000/meal_prep_bids"
      );
      const mealPrepData = await responseMealPrep.json();
      setMealPrepBids(mealPrepData);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/customers");
      const customersData = await response.json();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // Call fetch functions on initial render
  useEffect(() => {
    fetchCustomers(); // Fetch customers once
    fetchBids(); // Initial fetch for bids
  
    // Set up an interval to fetch bids every second
    const interval = setInterval(() => {
      fetchBids();
    }, 1000);
  
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  // Handle bid selection
  const handleSelectBid = async (bid, customerId, newStatus) => {
    if (!customerId) {
      alert("Please select a client for this bid.");
      return;
    }

    const updatedBid = {
      ...bid,
      customer_id: customerId,
      bid_status: newStatus,
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
        fetchBids(); // Refetch bids after update
        updateCalendar(newStatus, bid); // Update calendar when bid status changes
      } else {
        alert("Error updating the bid.");
      }
    } catch (error) {
      console.error("Error updating bid:", error);
      alert("Error updating the bid.");
    }
  };

  // Open the bid edit modal
  const handleEditCateringBid = (bid) => {
    setSelectedBid(bid);
    setIsEditCateringModalOpen(true);
    setIsContractModalOpen(false);
  };

  const handleEditMealBid = (bid) => {
    setSelectedBid(bid);
    setIsEditMealPrepModalOpen(true);
    setIsContractModalOpen(false);
  };

  const handleClose = () => {
    setIsCateringModalOpen(false);
    setIsMealPrepModalOpen(false);
    setIsEditCateringModalOpen(false);
    setIsEditMealPrepModalOpen(false);
    setIsContractModalOpen(false);
  };

  // Open the contract modal
  const handleCreateContract = (bid) => {
    setSelectedBid(bid);
    setIsContractModalOpen(true);
    setIsEditModalOpen(false);
  };

  const handleCreateBid = (newBid) => {
    setBids((prevBids) => [...prevBids, newBid]); // Add the new bid to the list
    setIsMealPrepModalOpen(false); // Close the modal
  };

  return (
    <div className="p-6 bg-emerald-50 min-h-screen">
      <BidTable
        bids={cateringBids}
        type="Catering"
        customers={customers}
        onSelectBid={handleSelectBid}
        onEditBid={handleEditCateringBid}
        onCreateContract={handleCreateContract}
        setIsCateringModalOpen={setIsCateringModalOpen}
        setIsMealPrepModalOpen={setIsMealPrepModalOpen}
        onSaveBid={handleCreateBid}
      />

      <BidTable
        bids={mealPrepBids}
        type="Meal Prep"
        customers={customers}
        onSelectBid={handleSelectBid}
        onEditBid={handleEditMealBid}
        onCreateContract={handleCreateContract}
        setIsCateringModalOpen={setIsCateringModalOpen}
        setIsMealPrepModalOpen={setIsMealPrepModalOpen}
        onSaveBid={handleCreateBid}
      />

      {/* Modals */}
      {isEditCateringModalOpen && (
        <EditCateringBidModal
          isOpen={isEditCateringModalOpen}
          onClose={handleClose}
          setIsOpen={setIsEditCateringModalOpen}
          bid={selectedBid}
          onSaveBid={handleCreateBid}
        />
      )}

      {isEditMealPrepModalOpen && (
        <EditMealPrepBidModal
          isOpen={isEditMealPrepModalOpen}
          onClose={handleClose}
          setIsOpen={setIsEditMealPrepModalOpen}
          bid={selectedBid}
          onSaveBid={handleCreateBid}
        />
      )}

      {isContractModalOpen && (
        <GenerateContract
          isOpen={isContractModalOpen}
          setIsOpen={setIsContractModalOpen}
          bid={selectedBid}
        />
      )}

      {isCateringModalOpen && (
        <CateringBidModal
          isOpen={isCateringModalOpen}
          onClose={handleClose}
          setIsOpen={setIsCateringModalOpen}
          onSaveBid={handleCreateBid}
        />
      )}

      {isMealPrepModalOpen && (
        <MealPrepBidModal
          isOpen={isMealPrepModalOpen}
          setIsOpen={setIsMealPrepModalOpen}
          onClose={handleClose}
          onSaveBid={handleCreateBid}
        />
      )}
    </div>
  );
}
