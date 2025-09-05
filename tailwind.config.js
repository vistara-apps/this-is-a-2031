/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 36%, 96%)',
        text: 'hsl(210, 50%, 20%)',
        accent: 'hsl(135, 70%, 45%)',
        danger: 'hsl(0, 80%, 50%)',
        primary: 'hsl(210, 96%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        dark: {
          bg: 'hsl(220, 40%, 8%)',
          surface: 'hsl(220, 35%, 12%)',
          border: 'hsl(220, 30%, 18%)',
          text: 'hsl(220, 15%, 85%)',
          muted: 'hsl(220, 15%, 65%)'
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px'
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px'
      },
      boxShadow: {
        'card': '0 8px 24px hsla(210, 50%, 10%, 0.12)',
        'modal': '0 12px 36px hsla(210, 50%, 10%, 0.16)'
      },
      animation: {
        'pulse-red': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}