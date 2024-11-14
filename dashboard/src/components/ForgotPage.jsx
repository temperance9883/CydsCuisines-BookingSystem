import React from "react";

export default function ForgotPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-fixed bg-center bg-[url('/path-to-your-background.jpg')] bg-white/30 backdrop-blur-sm">
      <header className="text-center mb-4">
        <h1 className="text-gold text-3xl font-serif mb-1">
          Password Recovery
        </h1>
      </header>

      <section className="bg-tan px-8 py-6 rounded-lg shadow-md text-center w-full max-w-md">
        <h3 className="text-gray-600 text-2xl mb-4">Reset Your Password</h3>
        <p className="text-gray-500 mb-6">
          Please enter your email address. We will send you instructions to
          reset your password.
        </p>

        <form
          action="/submit-forgot-password"
          method="POST"
          className="flex flex-col"
        >
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base bg-white"
          />
          <button
            type="submit"
            className="bg-gold text-white py-3 rounded-lg text-base w-full hover:bg-dark-gold transition-colors"
          >
            Send Reset Link
          </button>
        </form>
      </section>

      <footer className="mt-6 text-sm text-gray-500">
        <p>© 2024 Cyd's Cuisines. All rights reserved.</p>
      </footer>
    </div>
  );
}
