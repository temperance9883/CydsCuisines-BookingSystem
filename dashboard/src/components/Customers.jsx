import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AddCustomerModal from "./AddCustomerModal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone_number: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const navigate = useNavigate(); // Use useNavigate

  // Fetch customers data from your backend
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/customers");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateCustomer = async (e) => {
    e.preventDefault(); // Prevent form submission
    const url = editMode
      ? `http://localhost:5000/customers/${editingCustomerId}`
      : "http://localhost:5000/customers"; // POST for new customers
    const method = editMode ? "PUT" : "POST"; // PUT for editing, POST for adding

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      const customerData = await response.json();

      if (editMode) {
        // Update the customer in the state
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.customer_id === editingCustomerId ? customerData : customer
          )
        );
      } else {
        // Add the new customer to the state
        setCustomers((prevCustomers) => [...prevCustomers, customerData]);
      }

      // Optionally refetch customers after adding/updating
      await fetchCustomers();

      resetNewCustomer();
      setIsModalOpen(false);
      setEditMode(false);
      setEditingCustomerId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Open and close modal functions
  const openModal = (customer = null) => {
    if (customer) {
      setEditMode(true);
      setEditingCustomerId(customer.customer_id);
      setNewCustomer({
        name: customer.name,
        phone_number: customer.phone_number,
        email: customer.email,
      });
    } else {
      resetNewCustomer();
      setEditMode(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetNewCustomer();
    setEditMode(false);
    setEditingCustomerId(null);
  };

  const resetNewCustomer = () => {
    setNewCustomer({
      name: "",
      phone_number: "",
      email: "",
    });
  };

  // Delete customer
  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      // Optionally refetch customers after deletion to ensure data consistency
      await fetchCustomers();
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center mt-5">Error: {error}</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Customers</h1>

      <button
        onClick={() => openModal()}
        className="bg-green-500 text-white rounded-md p-2 mb-4 hover:bg-green-600 transition duration-200"
      >
        Add Customer
      </button>

      <ul className="mb-6">
        {customers.map((customer) => (
          <li key={customer.customer_id} className="mb-2">
            <div className="bg-gray-100 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <strong>{customer.name}</strong>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone_number}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(customer)} // Open modal for editing
                  className="bg-yellow-500 text-white rounded-md p-2 hover:bg-yellow-600 transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.customer_id)} // Handle delete
                  className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate("/booking")} // Pass customer ID
                  className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
                >
                  Book Service
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for adding/updating customer */}
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateCustomer} // Ensure the correct function is passed
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newCustomer.name}
          onChange={handleInputChange} // Use the updated input change handler
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={handleInputChange} // Use the updated input change handler
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Phone Number"
          value={newCustomer.phone_number}
          onChange={handleInputChange} // Use the updated input change handler
          required
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
      </AddCustomerModal>
    </div>
  );
}
