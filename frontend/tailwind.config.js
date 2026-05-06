/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F172A',
          50:  '#F0F4FF',
          100: '#D9E2FF',
          200: '#B3C5FF',
          300: '#8DA8FF',
          400: '#4C6EF5',
          500: '#2E4DB0',
          600: '#1E3A8A',
          700: '#162D6E',
          800: '#0F1F52',
          900: '#0F172A',
        },
        orange: {
          DEFAULT: '#FF6B2B',
          50:  '#FFF4EE',
          100: '#FFE4D0',
          200: '#FFC4A0',
          300: '#FFA070',
          400: '#FF7D45',
          500: '#FF6B2B',
          600: '#E05520',
          700: '#C04018',
          800: '#9A3010',
          900: '#7A2008',
        },
        bg: {
          DEFAULT: '#F8F9FB',
          card:    '#FFFFFF',
          dark:    '#0F172A',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        serif:   ['DM Serif Display', 'serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 10px 30px rgba(15,23,42,0.12)',
        'nav':    '0 2px 20px rgba(15,23,42,0.08)',
        'orange': '0 4px 20px rgba(255,107,43,0.35)',
      },
      animation: {
        'slide-down':   'slideDown 0.3s ease',
        'fade-in':      'fadeIn 0.4s ease',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'marquee':      'marquee 30s linear infinite',
        'countdown':    'countdownTick 1s ease-in-out infinite alternate',
      },
      keyframes: {
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        countdownTick: {
          from: { transform: 'scale(1)' },
          to:   { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}