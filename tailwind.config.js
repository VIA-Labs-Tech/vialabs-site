/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'via-teal': '#00E5E5',
        'via-pink': '#FF00FF',
        // Surfaces
        paper: '#F6F7F9',
        ink: {
          DEFAULT: '#0F1117',
          900: '#0B0D12',
          800: '#151821',
          700: '#1C202B',
          600: '#262B37',
        },
      },
      boxShadow: {
        'clean': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        // Layered shadows give cards real depth
        'card': '0 1px 2px rgba(15, 17, 23, 0.04), 0 10px 30px -12px rgba(15, 17, 23, 0.16)',
        'card-hover': '0 2px 4px rgba(15, 17, 23, 0.05), 0 22px 44px -16px rgba(15, 17, 23, 0.24)',
        'card-dark': 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 40px -18px rgba(0, 0, 0, 0.7)',
        'panel': '0 30px 80px -30px rgba(15, 17, 23, 0.35)',
      },
      letterSpacing: {
        'tightest': '-0.035em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
