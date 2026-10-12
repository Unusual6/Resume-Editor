/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c2410c',
        secondary: '#ea580c',
        accent: '#c2410c',
        'sf-bg': '#ffffff',
        'sf-surface': '#fafafa',
        'sf-card': '#f5f5f5',
        'sf-border': '#e5e5e5',
        'sf-hover': '#f0f0f0',
        'sf-text': '#1a1a1a',
        'sf-muted': '#737373',
        'sf-faint': '#a3a3a3',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
