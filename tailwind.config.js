/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './verbs/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        // One radius for every surface in the app.
        card: '14px',
      },
      transitionTimingFunction: {
        card: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
