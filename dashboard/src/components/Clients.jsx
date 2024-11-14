import React, { useEffect, useState } from "react";

export default function Clients() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch customer data
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/clients"); // Endpoint for fetching clients
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCustomers(data); // Set the customers state with the fetched data
    } catch (error) {
      setError(error.message); // Set the error state if an error occurs
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  useEffect(() => {
    fetchCustomers(); // Call the function to fetch customers
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if an error occurred
  }

  return (
    <div>
      <h1>Clients Info</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.customer_id}>
            {customer.first_name} {customer.last_name} - {customer.email} -{" "}
            {customer.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}
