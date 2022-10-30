/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        amplifrens: {
          primary: "#fefdfd",
          secondary: "#d9bcef",
          accent: "#5f43b2",
          neutral: "#240839",
          "base-100": "#010101",
          info: "#0CA6E9",
          success: "#2BD4BD",
          warning: "#F4C152",
          error: "#FB6F84",
        },
      },
    ],
  },
};
