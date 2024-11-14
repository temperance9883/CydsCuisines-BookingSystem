import React from "react";

export default function CreateProfile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfcf7] bg-fixed bg-cover bg-center bg-gradient-to-t from-white/70 via-white/50 to-white/30">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-serif text-[#d4af37] mb-1">
          Create Your Profile
        </h1>
      </header>

      <section className="bg-[#fff5e1] p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h3 className="text-[#A9B7A0] text-2xl mb-4">Sign Up</h3>
        <form
          action="/submit-create-profile"
          method="POST"
          className="flex flex-col items-center"
        >
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            required
            className="w-11/12 p-3 mb-3 border border-gray-300 rounded-lg text-base bg-white"
          />
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            required
            className="w-11/12 p-3 mb-3 border border-gray-300 rounded-lg text-base bg-white"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-11/12 p-3 mb-3 border border-gray-300 rounded-lg text-base bg-white"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            className="w-11/12 p-3 mb-3 border border-gray-300 rounded-lg text-base bg-white"
          />
          <input
            type="password"
            id="retype-password"
            name="retype-password"
            placeholder="Retype Your Password"
            required
            className="w-11/12 p-3 mb-3 border border-gray-300 rounded-lg text-base bg-white"
          />
          <button
            type="submit"
            className="bg-[#d4af37] text-white py-3 rounded-lg text-base w-11/12 hover:bg-[#c39e2e] transition-colors"
          >
            Create Profile
          </button>
        </form>
      </section>

      <footer className="mt-4 text-sm text-gray-500">
        <p>© 2024 Cyd's Cuisines. All rights reserved.</p>
      </footer>
    </div>
  );
}
