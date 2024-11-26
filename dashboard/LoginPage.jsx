import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function LoginPage({ onLogin, isAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        console.log(data.message);
        onLogin();
        navigate("/home");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-[#fdfcf7] bg-cover bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5)), url('/goldflower.avif')",
      }}
    >
      <header className="text-center mb-10 flex flex-col bg-black w-full px-8 max-w-screen-xl mx-auto fixed top-0 left-0 right-0 z-10">
        <h1 className="text-[#d4af37] text-4xl mb-2">Cyd's Cuisines</h1>
        <h2 className="text-[#d4af37] text-2xl">Booking Management Site</h2>
      </header>

      <section className="bg-white p-8 rounded-md shadow-md text-center max-w-md w-full">
        <h3 className="text-black text-xl mb-4">
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
            className="w-4/5 bg-black text-[#DDC8A6] p-2 rounded-md hover:bg-[#DDC8A6] hover:text-black transition duration-300"
          >
            Login
          </button>

          {!isAuthenticated && (
            <div className="mt-4">
              <Link
                to="/forgotpass"
                className="block w-4/5 bg-black text-[#DDC8A6] p-2 rounded-md text-center hover:bg-[#DDC8A6] hover:text-black transition duration-300"
              >
                Forgot Password?
              </Link>
            </div>
          )}
        </form>
      </section>

      <footer className="bg-[#fff5e1] mt-4 text-sm text-[#7f7f7f]">
        <p>© 2024 Cyd's Cuisines. All rights reserved.</p>
      </footer>
    </div>
  );
}
