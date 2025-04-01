/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.red[500],  // Uses Tailwind's red-500 color
        secondary: colors.sky[500], // Uses Tailwind's sky-500 color
        tertiary: colors.black,  // Uses Tailwind's black color
      },
    },
  },
  plugins: [],
}
