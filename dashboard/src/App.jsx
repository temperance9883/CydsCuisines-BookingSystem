import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Customers from "./components/Customers";
import Navbar from "./components/Navbar";
import BidComponent from "./components/Bids";
import Booking from "./components/Booking";
import Home from "./components/Home";
import Support from "./components/Support";
import ForgotPage from "./components/ForgotPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true); // User successfully logged in
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // User logged out
    navigate("/"); // Navigate to the login page after logout
  };

  return (
    <div>
      {/* Render Navbar only if authenticated */}
      {isAuthenticated && (
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      )}

      {/* Define Routes */}
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

        {/* Non-authenticated route for Forgot Password */}
        {!isAuthenticated && (
          <Route path="/forgotpass" element={<ForgotPage />} />
        )}

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/customers"
          element={isAuthenticated ? <Customers /> : <Navigate to="/" />}
        />
        <Route
          path="/bids"
          element={isAuthenticated ? <BidComponent /> : <Navigate to="/" />}
        />
        <Route
          path="/booking"
          element={isAuthenticated ? <Booking /> : <Navigate to="/" />}
        />
        <Route
          path="/support"
          element={isAuthenticated ? <Support /> : <Navigate to="/" />}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
