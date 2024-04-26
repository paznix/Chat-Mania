/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pal: ["Palanquin", "serif"],
        farro: ["Farro", "sans-serif"],
        asul: ["Asul", "sans-serif"],
      },
    },
  },
  plugins: [],
}

