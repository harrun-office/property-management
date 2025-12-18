/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#E8F0EF',
          100: '#C1D9D7',
          200: '#9AC2BF',
          300: '#73ABA7',
          400: '#4C948F',
          500: '#0F2F2E', // Primary
          600: '#0C2524',
          700: '#091C1B',
          800: '#061312',
          900: '#030A09',
        },
        stone: {
          50: '#F5F3F0',
          100: '#E8E4DD',
          200: '#D6CFC4', // Primary
          300: '#C4B9AB',
          400: '#B2A392',
          500: '#A08D79',
          600: '#8E7766',
          700: '#7C6153',
          800: '#6A4B40',
          900: '#58352D',
        },
        brass: {
          50: '#F5F0E8',
          100: '#E8D9C1',
          200: '#DBC29A',
          300: '#CEAB73',
          400: '#C1944C',
          500: '#B08D57', // Primary
          600: '#9D7A4C',
          700: '#8A6741',
          800: '#775436',
          900: '#64412B',
        },
        eucalyptus: {
          50: '#E8F0ED',
          100: '#C1D9D1',
          200: '#9AC2B5',
          300: '#73AB99',
          400: '#4C947D',
          500: '#5F7F73', // Primary
          600: '#4C6658',
          700: '#394D3D',
          800: '#263422',
          900: '#131B07',
        },
        porcelain: {
          DEFAULT: '#F5F4F1',
          50: '#F5F4F1',
          100: '#E8E6E1',
          200: '#DBD8D1',
        },
        charcoal: {
          DEFAULT: '#1C1F23',
          50: '#2A2D32',
          100: '#1C1F23',
          200: '#0E0F11',
        },
        architectural: {
          DEFAULT: '#8E9491',
          50: '#A8ADA9',
          100: '#8E9491',
          200: '#747B79',
        },
        success: {
          DEFAULT: '#4E7C6A',
          light: '#5F7F73',
        },
        warning: {
          DEFAULT: '#C29A5B',
        },
        error: {
          DEFAULT: '#8F3E3E',
        },
      },
    },
  },
  plugins: [],
}

