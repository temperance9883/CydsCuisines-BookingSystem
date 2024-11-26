import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCustomerModal from "./AddCustomerModal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const navigate = useNavigate();

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

  const handleAddOrUpdateCustomer = async (e) => {
    e.preventDefault();
    const url = editMode
      ? `http://localhost:5000/customers/${editingCustomerId}`
      : "http://localhost:5000/customers";
    const method = editMode ? "PUT" : "POST";

    const customerToSend = {
      ...newCustomer,
      name: `${newCustomer.first_name} ${newCustomer.last_name}`,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      const customerData = await response.json();

      if (editMode) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.customer_id === editingCustomerId ? customerData : customer
          )
        );
      } else {
        setCustomers((prevCustomers) => [...prevCustomers, customerData]);
      }

      await fetchCustomers();
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (customer = null) => {
    if (customer) {
      const [first_name, last_name] = customer.name.split(" ");
      setEditMode(true);
      setEditingCustomerId(customer.customer_id);
      setNewCustomer({
        first_name: first_name || "",
        last_name: last_name || "",
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
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
    });
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/customers/${customerId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.json();
        console.error("Error:", errorMessage);
        return;
      }

      // Update the customers state to remove the deleted customer
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.customer_id !== customerId)
      );

      closeModal(); // Close the modal after success
    } catch (error) {
      console.error("Error:", error);
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
    <div className="p-5 bg-[#fdfcf7]">
      <div className="flex justify-center">
        <button
          onClick={() => openModal()}
          className="mt-4 bg-black text-white font-bold rounded hover:bg-gray-600 rounded-md p-2 mb-4 transition"
        >
          Add New Client
        </button>
      </div>

      <div className="bg-[url('/goldpaper.jpg')] bg-cover backdrop-blur-sm bg-opacity-100 p-4 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse bg-white rounded-lg">
            <thead>
              <tr className="bg-black text-white rounded-lg">
                <th className="py-2 px-4 border-b text-center">Customer ID</th>
                <th className="py-2 px-4 border-b text-center">Name</th>
                <th className="py-2 px-4 border-b text-center">Phone Number</th>
                <th className="py-2 px-4 border-b text-center">Email Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.customer_id}
                  onClick={() => openModal(customer)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="py-2 px-4 border-b text-left">
                    {customer.customer_id}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {customer.name}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {customer.phone_number}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {customer.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="text-center mt-20">
        © 2024 Cyd's Cuisines. All rights reserved.
      </footer>

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrUpdateCustomer}
        onDelete={() => handleDeleteCustomer(editingCustomerId)}
        editMode={editMode}
      >
        <div className="space-y-4">
          <input
            type="text"
            name="first_name"
            value={newCustomer.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="last_name"
            value={newCustomer.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="p-2 border rounded w-full"
          />
          <input
            type="tel"
            name="phone_number"
            value={newCustomer.phone_number}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="p-2 border rounded w-full"
          />
          <input
            type="email"
            name="email"
            value={newCustomer.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-2 border rounded w-full"
          />
        </div>
      </AddCustomerModal>
    </div>
  );
}
