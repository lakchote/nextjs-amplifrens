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
          primary: "#0D0D2B",
          secondary: "#2B076E",
          accent: "#3671E9",
          neutral: "#FFFFFF",
          "base-100": "#0D0D2B",
        },
      },
    ],
  },
};
