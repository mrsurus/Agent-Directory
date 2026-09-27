/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dfe9ff',
          200: '#c1d3ff',
          300: '#98b3ff',
          400: '#6d8bff',
          500: '#4763f5',
          600: '#3546d9',
          700: '#2b37ae',
          800: '#26308a',
          900: '#232c6e',
        },
      },
    },
  },
  plugins: [],
}
