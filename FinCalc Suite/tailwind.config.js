/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Arial',
          'sans-serif'
        ],
      },
      fontSize: {
        base: ['16px', '24px'],
      },
      spacing: {
        '4.5': '1.125rem',
      },
      minHeight: {
        '11': '2.75rem',
      },
      colors: {
        gray: {
          150: '#EBEDF0',
          250: '#E2E4E8',
          350: '#D1D4DB',
          450: '#9DA3AF',
          550: '#6E7582',
          650: '#4E5561',
          750: '#353B47',
          850: '#23272F',
          950: '#0F1117',
        },
      },
      boxShadow: {
        'input-focus': '0 0 0 2px rgba(79, 70, 229, 0.1)',
      },
    },
  },
  plugins: [],
};