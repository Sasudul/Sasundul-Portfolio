/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
        mono: ['"Fragment Mono"', 'monospace'],
      },
      colors: {
        accent: 'var(--accent)',
        muted: 'var(--muted)',
      },
    },
  },
  plugins: [],
}
