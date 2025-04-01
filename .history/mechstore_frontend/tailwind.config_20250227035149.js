/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF4444", // Red-500
        secondary: "#0EA5E9", // Sky-500
        tertiary: "#000000", // Black
      },
    },
  },
  plugins: [],
}
