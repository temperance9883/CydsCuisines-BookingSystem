import React, { useState, useEffect } from "react";
import CateringBidModal from "./CateringBidModel";
import MealPrepBidModal from "./MealPrepBidModel";
import GenerateContract from "./GenerateContract";
import EditBidModal from "./EditBidModal.jsx";

const BidTable = ({
  bids,
  type,
  onSelectBid,
  customers,
  onEditBid,
  onCreateContract,
  setIsCateringModalOpen,
  setIsMealPrepModalOpen,
}) => (
  <div className="bid-section mb-8 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold mb-4">{`${type} Bids`}</h2>
    <div className="overflow-auto">
      <table className="min-w-full table-auto ">
        <thead>
          <tr className="bg-gray-700 text-white text-sm uppercase leading-normal">
            <th className="py-3 px-6 text-left">Assign Client</th>
            <th className="py-3 px-6 text-left">Miles</th>
            <th className="py-3 px-6 text-left">Service Fee</th>
            <th className="py-3 px-6 text-left">Estimated Groceries</th>
            <th className="py-3 px-6 text-left">Clean Up Fee</th>
            <th className="py-3 px-6 text-left">Decoration Fee</th>
            <th className="py-3 px-6 text-left">Bid Status</th>
            <th className="py-3 px-6 text-left">Estimated Bid Price</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr
              key={type === "Catering" ? bid.catering_bid_id : bid.meal_bid_id}
              className="border-b border-gray-200 hover:bg-gray-200 cursor-pointer"
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
              <td className="py-3 px-6">${bid.cleanup_fee}</td>
              <td className="py-3 px-6">${bid.decoration_fee}</td>
              <td className="py-3 px-6">{bid.bid_status}</td>
              <td className="py-3 px-6">${bid.estimated_bid_price}</td>
              <td className="py-3 px-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent click from propagating to row
                    onCreateContract(bid); // Trigger the contract modal
                  }}
                  className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
                >
                  Create Contract
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conditional Buttons at the bottom */}
      <div className="flex justify-center gap-4 mt-4 w-full">
        {type === "Catering" && (
          <button
            onClick={() => setIsCateringModalOpen(true)}
            className="bg-black text-white rounded-md px-4 py-2 w-full"
          >
            Create Catering Bid
          </button>
        )}
        {type === "Meal Prep" && (
          <button
            onClick={() => setIsMealPrepModalOpen(true)}
            className="bg-black text-white rounded-md px-4 py-2 w-full"
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false); // State for contract modal visibility

  // Ensure the fetchBids function is in scope
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

  // Fetch customers when component mounts
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
    fetchBids(); // Call the fetchBids function after fetching customers
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
        fetchBids(); // Refetch the bids after updating
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
    setIsContractModalOpen(false); // Close the contract modal when editing a bid
  };

  const handleCreateContract = (bid) => {
    const clientName = customers.find(
      (customer) => customer.customer_id === bid.customer_id
    )?.name; // Get client name
    console.log("Creating contract for bid: ", bid);
    setSelectedBid(bid);
    setIsContractModalOpen(true); // Open contract modal
    setIsEditModalOpen(false); // Close edit modal if open
  };

  const handleCloseContractModal = () => {
    setIsContractModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen bg-[url('/goldflower.jpg')]">
      <header>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Bids Management
        </h1>
      </header>
      {/* Render modals */}
      {isContractModalOpen && selectedBid && (
        <GenerateContract
          isOpen={isContractModalOpen}
          bid={selectedBid}
          clientName={
            selectedBid?.customer_id &&
            customers.find(
              (customer) => customer.customer_id === selectedBid.customer_id
            )?.name
          } // Dynamically fetch client name
          onClose={handleCloseContractModal}
        />
      )}

      {isMealPrepModalOpen && (
        <MealPrepBidModal
          onClose={() => setIsMealPrepModalOpen(false)}
          fetchBids={fetchBids}
        />
      )}
      {isCateringModalOpen && (
        <CateringBidModal
          onClose={() => setIsCateringModalOpen(false)}
          fetchBids={fetchBids}
        />
      )}
      {isEditModalOpen && selectedBid && (
        <EditBidModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          bid={selectedBid}
          fetchBids={fetchBids}
        />
      )}

      {/* Render bid tables */}
      <BidTable
        bids={cateringBids}
        type="Catering"
        onSelectBid={handleSelectBid}
        customers={customers}
        onEditBid={handleEditBid}
        onCreateContract={handleCreateContract}
        setIsCateringModalOpen={setIsCateringModalOpen}
      />
      <BidTable
        bids={mealPrepBids}
        type="Meal Prep"
        onSelectBid={handleSelectBid}
        customers={customers}
        onEditBid={handleEditBid}
        onCreateContract={handleCreateContract}
        setIsMealPrepModalOpen={setIsMealPrepModalOpen}
      />
    </div>
  );
}
