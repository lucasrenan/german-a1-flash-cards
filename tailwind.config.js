/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './verbs/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Near-black: text in light mode, background in dark mode.
        ink: {
          DEFAULT: '#151515',
          soft: '#2B2B2B',
        },
        // Warm off-white: background in light mode, text in dark mode.
        cream: {
          DEFAULT: '#F6F4EF',
          paper: '#FFFDF8',
        },
        // Primary accent / CTAs.
        vermilion: {
          DEFAULT: '#FE4D03',
          dark: '#E04402',
          soft: '#FFE4D6',
        },
        // Secondary accent: highlights, notes, "easy".
        dandelion: {
          DEFAULT: '#FFD965',
          soft: '#FFF6DE',
        },
        // Semantic green: "good", review status.
        moss: {
          DEFAULT: '#3F6B4E',
          soft: '#E1EBE2',
          // Lifted for legibility on ink — the base green is too dark on #151515.
          light: '#86B894',
        },
        // Semantic red: "again", due status.
        brick: {
          DEFAULT: '#B3392A',
          soft: '#F6DFDA',
          light: '#E8705C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Uppercase micro-label used to title every section and card face.
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '600' }],
        word: ['2.125rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
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
