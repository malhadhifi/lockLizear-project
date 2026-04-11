/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        sidebar: '#1e293b',
        'sidebar-hover': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
