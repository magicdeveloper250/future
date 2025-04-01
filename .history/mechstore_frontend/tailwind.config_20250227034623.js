/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EF4444", // Equivalent to Tailwind's red-500
        secondary: "#0EA5E9", // Equivalent to Tailwind's sky-500
        tertiary: "#000000", // Black
      },
    },
  },
  plugins: [],
}
