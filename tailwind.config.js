/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#cc785c',
        secondary: '#d98a6a',
        accent: '#cc785c',
        'dark-bg': '#1b1b1b',
        'dark-surface': '#222222',
        'dark-card': '#2a2a2a',
        'dark-border': '#383838',
        'dark-hover': '#333333',
        'dark-text': '#e0e0e0',
        'dark-muted': '#888888',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
