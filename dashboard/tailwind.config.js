/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // specifies the files that Tailwind should scan for class names
  theme: {
    extend: {
      colors: {
        primary: "#D7A676", // You can add custom colors here
        secondary: "#FAF3E3",
        accent: "#A9B7A0",
      },
      boxShadow: {
        "custom-light": "0 4px 12px rgba(0, 0, 0, 0.1)", // Custom shadow for your table
        "custom-dark": "0 6px 15px rgba(0, 0, 0, 0.2)", // A darker shadow example
      },
    },
  },
  plugins: [
    // You can add Tailwind plugins here, for example:
    // require('@tailwindcss/forms'),
  ],
};
