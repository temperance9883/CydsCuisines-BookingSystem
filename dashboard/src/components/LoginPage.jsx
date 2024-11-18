import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const loginData = { username, password };

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Log success message
        onLogin(); // Update the parent state to authenticated
        navigate("/customers"); // Redirect to the customers page
      } else {
        setErrorMessage(data.message); // Show error message if login fails
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcf7] bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)), url('./Photos/background1.jpg')",
      }}
    >
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#d4af37] mb-2">
          Cyd's Cuisines
        </h1>
        <h2 className="text-2xl text-[#d4af37]">Booking Management Site</h2>
      </header>

      <section className="bg-[#ffefe1] p-8 rounded-md shadow-md text-center max-w-md w-full">
        <h3 className="text-[#A9B7A0] text-xl mb-4">
          Welcome back! Please log in to continue
        </h3>

        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-4/5 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-4/5 p-2 mb-4 border border-gray-300 rounded-md focus:outline-none"
          />
          <button
            type="submit"
            className="w-4/5 bg-[#d4af37] text-white p-2 rounded-md hover:bg-[#c39e2e] transition duration-300"
          >
            Login
          </button>

          <div className="flex mt-4 space-y-2">
            <Link
              to="/forgotpass"
              className="block w-4/5 bg-[#d4af37] text-white p-2 rounded-md text-center hover:bg-[#c39e2e] mr-10"
            >
              Forgot Password?
            </Link>
            <Link
              to="/createprofile"
              className="block w-4/5 bg-[#d4af37] text-white p-2 rounded-md text-center hover:bg-[#c39e2e]"
            >
              Create A New Profile
            </Link>
          </div>
        </form>
      </section>

      <footer className="bg-[#fff5e1] mt-4 text-sm text-[#7f7f7f]">
        <p>© 2024 Cyd's Cuisines. All rights reserved.</p>
      </footer>
    </div>
  );
}
