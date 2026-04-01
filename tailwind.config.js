/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#8b5cf6',
        },
        accent: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          DEFAULT: '#22d3ee',
        },
        surface: {
          800: '#27272a',
          850: '#1f1f22',
          900: '#18181b',
          950: '#09090b',
        },
      },
      animation: {
        shimmer:      'shimmer 1.8s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'border-spin':'borderSpin 3s linear infinite',
        'slide-up':   'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fade-up':    'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.5' },
          '50%':     { opacity: '1'   },
        },
        borderSpin: {
          to: { transform: 'rotate(360deg)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(1rem)',  opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        fadeUp: {
          '0%':   { transform: 'translateY(2rem)',  opacity: '0' },
          '100%': { transform: 'translateY(0)',      opacity: '1' },
        },
        blob: {
          '0%':   { transform: 'translate(0px, 0px) scale(1)' },
          '33%':  { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%':  { transform: 'translate(-20px,20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
