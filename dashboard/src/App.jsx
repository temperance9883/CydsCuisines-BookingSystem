import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate, // Import useNavigate hook
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Customers from "./components/Customers";
import Navbar from "./components/Navbar";
import BidComponent from "./components/Bids";
import Booking from "./components/Booking";
import Home from "./components/Home";
import Support from "./components/Support";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const handleLogin = () => {
    setIsAuthenticated(true); // User successfully logged in
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // User logged out
    navigate("/"); // Navigate to the login page after logout
  };

  return (
    <div>
      {/* Render Navbar only if authenticated and NOT on Home page */}
      {isAuthenticated && (
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      )}

      {/* Define Routes */}
      <Routes>
        {/* Login Route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

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

        {/* Catch-all route to redirect to /home if route doesn't exist */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;
