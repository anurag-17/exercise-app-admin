/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      "theme-color": "#9f0050",
      primary: "#C21494",
      black: "#000",
      white:"#fff",
    },
    extend: {},
  },
  plugins: [],
};
