/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./ecossistema-guilda/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        wurm: {
          bg: '#050505',
          panel: '#0a0a0a',
          border: '#262626',
          accent: '#d4b483', // Guild Gold
          accentDim: '#8a7453',
          success: '#3e6b46', // Desaturated Green
          warning: '#b45309',
          text: '#e5e5e5',
          muted: '#737373'
        }
      }
    },
  },
  plugins: [],
}
