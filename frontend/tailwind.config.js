/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#635BDB',
          hover: '#5248CA',
          light: '#EEECFF',
          dark: '#3F37A8',
        },
        lavender: '#EEECFF',
        campus: {
          bg: '#F8F9FC',
          surface: '#FFFFFF',
          text: '#202338',
          muted: '#74788A',
          border: '#E2E6F0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
