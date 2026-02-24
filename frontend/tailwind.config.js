/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // primary color used throughout the app (was blue-600)
        primary: {
          light: '#60a5fa',    // roughly blue-400 for hover backgrounds
          DEFAULT: '#2563eb',  // blue-600 main shade
          dark: '#1e40af',     // blue-800 for gradients/dark variants
        },
      },
    },
  },
  plugins: [],
}

