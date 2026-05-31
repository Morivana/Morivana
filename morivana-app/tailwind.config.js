/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        'green-dark':   '#1a3a1a',
        'green-mid':    '#2d6b2d',
        'green-bright': '#4caf50',
        'green-light':  '#8bc34a',
        'citrus':       '#c8e630',
        'citrus-dim':   '#a8c020',
        'cream':        '#f5f0dc',
        'warm-white':   '#faf8f0',
        'brand-orange': '#e87c20',
        'brand-yellow': '#f5c842',
        'pink-accent':  '#e8507a',
        'brand-dark':   '#0d1f0d',
      },
      fontFamily: {
        display:   ['"Montserrat"', 'sans-serif'],
        condensed: ['"Montserrat"', 'sans-serif'],
        body:      ['"DM Sans"', 'sans-serif'],
      },
    }
  },
  plugins: [require('@tailwindcss/forms')],
}

