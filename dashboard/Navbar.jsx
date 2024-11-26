import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, handleLogout }) {
  return (
    <header className="text-center w-full font-normal bg-black text-white">
      {/* Header Texts */}
      <h1 className="bg-black text-[#DDC8A6] font-normal py-4 text-2xl">
        Cyd's Cuisines
      </h1>
      <h2 className="bg-black text-white font-normal py-2 text-3xl">
        Booking Management Site
      </h2>

      {/* Navbar */}
      <nav className="relative bg-white text-black text-center p-0 m-0 flex justify-center items-center w-full h-20 shadow-md">
        <ul className="flex m-0 p-0 list-none flex-row">
          <li className="flex pr-20">
            <Link
              to="/home"
              className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
            >
              Home
            </Link>
          </li>
          <li className="flex pr-20">
            <Link
              to="/customers"
              className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
            >
              Client Management
            </Link>
          </li>
          <li className="flex pr-20">
            <Link
              to="/booking"
              className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
            >
              Event Calendar
            </Link>
          </li>
          <li className="flex pr-20">
            <Link
              to="/bids"
              className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
            >
              Bid Management
            </Link>
          </li>
          <li className="flex pr-20">
            <Link
              to="/support"
              className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
            >
              Support
            </Link>
          </li>
          {/* Conditional rendering of Login or Logout based on authentication */}
          {isAuthenticated ? (
            <li className="flex">
              <button
                onClick={handleLogout}
                className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
              >
                Logout
              </button>
            </li>
          ) : (
            <li className="flex">
              <Link
                to="/"
                className="inline-block px-5 py-2 text-black text-lg font-bold transition duration-300 hover:bg-white hover:text-[#DDC8A6] rounded"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
