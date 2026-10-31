/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        deutsch: {
          der: '#3b82f6', // Masculine Blue
          die: '#ef4444', // Feminine Red
          das: '#22c55e', // Neutral Green
          plural: '#eab308', // Plural Yellow
        },
      },
    },
  },
  plugins: [],
};
