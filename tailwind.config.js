/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      screens: {
        sm: '640px', // Tablet
        md: '768px', // Small Desktop
        lg: '1024px', // Large Desktop
        xl: '1280px',
      },
    },
  },
  plugins: [],

}