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
          50: '#E8F3F3',
          100: '#C1E0E0',
          200: '#9ACDCD',
          300: '#73BABA',
          400: '#4CA7A7',
          500: '#2D5F5F', // Primary - Rich Teal Blue
          600: '#244C4C',
          700: '#1B3939',
          800: '#122626',
          900: '#091313',
        },
        stone: {
          50: '#FCF9F5',
          100: '#F8F2E8',
          200: '#F0E6D6', // Primary - Warm Sand
          300: '#E8DAC4',
          400: '#E0CEB2',
          500: '#D8C2A0',
          600: '#B8A586',
          700: '#98886C',
          800: '#786B52',
          900: '#584E38',
        },
        brass: {
          50: '#FBF4E8',
          100: '#F7E9D1',
          200: '#F3DEBA',
          300: '#EFD3A3',
          400: '#EBC88C',
          500: '#E8B86D', // Primary - Vibrant Gold
          600: '#C59A5C',
          700: '#A27C4B',
          800: '#7F5E3A',
          900: '#5C4029',
        },
        eucalyptus: {
          50: '#E8F5F0',
          100: '#C1E6D6',
          200: '#9AD7BC',
          300: '#73C8A2',
          400: '#4CB988',
          500: '#5FB896', // Primary - Fresh Mint
          600: '#4C9378',
          700: '#396E5A',
          800: '#26493C',
          900: '#13241E',
        },
        porcelain: {
          DEFAULT: '#FFFEFB',
          50: '#FFFEFB',
          100: '#FAF7F0',
          200: '#F5F0E5',
        },
        charcoal: {
          DEFAULT: '#3A3D42',
          50: '#4A4D52',
          100: '#3A3D42',
          200: '#2A2D32',
        },
        architectural: {
          DEFAULT: '#6B7875',
          50: '#8B9693',
          100: '#6B7875',
          200: '#4B5A57',
        },
        success: {
          DEFAULT: '#4FA87A',
          light: '#5FB896',
        },
        warning: {
          DEFAULT: '#F5C98A',
        },
        error: {
          DEFAULT: '#D67A7A',
        },
      },
    },
  },
  plugins: [],
}

