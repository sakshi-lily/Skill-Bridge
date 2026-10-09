/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f0ff',
          100: '#ede4ff',
          200: '#dccaff',
          300: '#c5a3ff',
          400: '#a872fd',
          500: '#9047f8',
          600: '#803BE8', // Primary requested purple accent
          700: '#6c27cf',
          800: '#5920aa',
          900: '#4a1c8b',
          950: '#2c0c59',
        },
        lavender: {
          50: '#faf7ff',
          100: '#f3ebff',
          200: '#ebd9ff',
          300: '#dfbfff',
        },
        softpink: {
          50: '#fff5f8',
          100: '#ffe4ee',
          200: '#ffcce0',
          300: '#ffa1ca',
        },
        dark: {
          bg: '#0d0b18',
          card: '#161329',
          cardMuted: '#1b1733',
          border: '#2a244d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(128, 59, 232, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(128, 59, 232, 0.07), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 30px -5px rgba(128, 59, 232, 0.35)',
      },
    },
  },
  plugins: [],
}

