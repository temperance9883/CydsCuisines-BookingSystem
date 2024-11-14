import { useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Customers from "./components/Customers";
import Navbar from "./components/Navbar";
import BidComponent from "./components/Bids";
import Booking from "./components/Booking";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true); // Set user as authenticated
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false); // Reset authentication state
  };

  return (
    <Router>
      <div>
        {/* Always render the Navbar, passing the auth status and logout handler */}
        <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

        <Routes>
          {/* If not authenticated, show login page */}
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

          {/* If authenticated, show Customers */}
          <Route
            path="/customers"
            element={
              isAuthenticated ? (
                <Customers /> // Customers page
              ) : (
                <Navigate to="/" /> // Redirect to login if not authenticated
              )
            }
          />

          {/* Add other authenticated routes */}
          <Route
            path="/bids"
            element={isAuthenticated ? <BidComponent /> : <Navigate to="/" />}
          />
          <Route
            path="/booking"
            element={isAuthenticated ? <Booking /> : <Navigate to="/" />}
          />

          {/* Catch-all route to redirect to /customers */}
          <Route path="*" element={<Navigate to="/customers" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
