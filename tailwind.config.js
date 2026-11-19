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
        // Core Palette (Requested Theme)
        // #7B9669 - Sage Olive Green (Primary brand)
        // #6C8480 - Slate Teal / Muted Green (Secondary brand accent)
        // #E6E6E6 - Neutral Light Gray (Clean surfaces, borders, containers)
        // #BAC8B1 - Soft Pale Celadon (Delicate highlights, badges, glow)
        // #404E3B - Deep Dark Forest Green (Dark primary, strong contrast, headings)
        brand: {
          50: '#f5f7f3',
          100: '#e7ece2',
          200: '#BAC8B1', // Soft Pale Celadon (#BAC8B1)
          300: '#a2b696',
          400: '#8da57f',
          500: '#7B9669', // Primary Sage Green (#7B9669)
          600: '#688257',
          700: '#526844',
          800: '#404E3B', // Deep Forest Green (#404E3B)
          900: '#2f3b2a',
          950: '#1b2318',
        },
        sage: {
          light: '#BAC8B1',
          DEFAULT: '#7B9669',
          dark: '#404E3B',
        },
        celadon: {
          DEFAULT: '#BAC8B1',
          light: '#dce4d7',
          dark: '#8da57f',
        },
        slateGreen: {
          50: '#f3f6f5',
          100: '#e4ecea',
          200: '#c9dad7',
          300: '#98b5b0',
          400: '#6C8480', // Slate Teal (#6C8480)
          500: '#5b726e',
          600: '#4b5e5b',
          700: '#3c4b49',
          800: '#2d3937',
          900: '#212928',
          950: '#141a19',
          light: '#8fa5a2',
          DEFAULT: '#6C8480',
          dark: '#4f615e',
        },
        neutralSurface: {
          DEFAULT: '#E6E6E6', // Neutral Surface (#E6E6E6)
          50: '#f9faf8',
          100: '#f2f3f1',
          200: '#E6E6E6',
          300: '#d5d9d2',
          400: '#BAC8B1',
          subtle: '#f4f6f3',
        },
        forest: {
          DEFAULT: '#404E3B', // Deep Forest (#404E3B)
          dark: '#2d3829',
          deep: '#182017',
        },
        // Re-map purple and lavender to the sage & forest palette
        purple: {
          50: '#f5f7f3',
          100: '#e7ece2',
          200: '#BAC8B1', // Celadon highlight
          300: '#a2b696',
          400: '#8da57f',
          500: '#7B9669', // Sage primary
          600: '#688257',
          700: '#526844',
          800: '#404E3B', // Forest dark
          900: '#2f3b2a',
          950: '#1b2318',
        },
        lavender: {
          50: '#f7f9f6',
          100: '#eef2ec',
          200: '#e0e7dc',
          300: '#BAC8B1',
        },
        // Re-map pink and softpink to slate teal-green accent (#6C8480)
        pink: {
          50: '#f3f6f5',
          100: '#e4ecea',
          200: '#c9dad7',
          300: '#98b5b0',
          400: '#6C8480', // Slate teal
          500: '#5b726e',
          600: '#4b5e5b',
          700: '#3c4b49',
          800: '#2d3937',
          900: '#212928',
          950: '#141a19',
        },
        softpink: {
          50: '#f3f6f5',
          100: '#e4ecea',
          200: '#c9dad7',
          300: '#6C8480',
        },
        // Re-map violet & indigo so existing classes map seamlessly to the natural palette
        violet: {
          50: '#f3f6f5',
          100: '#e4ecea',
          200: '#BAC8B1',
          300: '#98b5b0',
          400: '#6C8480',
          500: '#7B9669',
          600: '#526844',
          700: '#404E3B',
          800: '#2f3b2a',
          900: '#212928',
          950: '#141a19',
        },
        indigo: {
          50: '#f3f6f5',
          100: '#e4ecea',
          200: '#BAC8B1',
          300: '#8fa5a2',
          400: '#6C8480',
          500: '#526844',
          600: '#404E3B',
          700: '#3c4b49',
          800: '#2d3937',
          900: '#1b2318',
          950: '#121711',
        },
        dark: {
          bg: '#121711',       // Deepest forest tone
          card: '#182017',     // Forest dark card surface
          cardMuted: '#1e261d',// Subtle secondary surface
          border: '#2e3b2b',   // Border with olive undertone
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(123, 150, 105, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(123, 150, 105, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 30px -5px rgba(123, 150, 105, 0.35)',
      },
    },
  },
  plugins: [],
}
