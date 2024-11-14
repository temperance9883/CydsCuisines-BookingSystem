import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, handleLogout }) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between">
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/customers"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Customers
          </Link>
        </li>
        <li>
          <Link
            to="/bids"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Bids
          </Link>
        </li>
        <li>
          <Link
            to="/booking"
            className="text-white hover:text-yellow-300 transition duration-300"
          >
            Booking
          </Link>
        </li>
        {isAuthenticated ? (
          <li>
            <button
              onClick={handleLogout}
              className="text-white hover:text-yellow-300 transition duration-300"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="text-white hover:text-yellow-300 transition duration-300"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
