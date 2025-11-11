/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          coral: "#F76C5E",
          azure: "#2B7A78",
          mint: "#79C7A7",
          beige: "#E8DCC7",
          teal: "#17252A",
        },
        fontFamily: {
          serif: ["Playfair Display", "serif"],
          sans: ["Inter", "sans-serif"],
        },
      },
    },
    plugins: [],
  }