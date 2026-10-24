import colors from 'tailwindcss/colors';

// The whole site is styled with `brand-*` colours. Change ACTIVE_PALETTE to re-theme everything at once.
const PALETTES = {
  peach: {
    50: '#fff8f3',
    100: '#ffefe5',
    200: '#ffdcc9',
    300: '#ffc4a6',
    400: '#fba984',
    500: '#e98a5f',
    600: '#cf6f45',
    700: '#a9532e',
    800: '#85402a',
    900: '#5e2e20',
    950: '#3a1b13',
  },
  blue: colors.sky,
};
const ACTIVE_PALETTE = 'peach';

// Shadow tint follows the palette so cards don't glow the wrong colour.
const SHADOW_RGB = ACTIVE_PALETTE === 'peach' ? '94 46 32' : '12 74 110';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // `accent` is the headline/highlight colour (rose pink on peach, cyan on blue).
      colors: { brand: PALETTES[ACTIVE_PALETTE], accent: ACTIVE_PALETTE === 'peach' ? colors.rose : colors.cyan },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: `0 1px 2px rgb(${SHADOW_RGB} / 0.05), 0 8px 24px -8px rgb(${SHADOW_RGB} / 0.14)`,
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -50px) scale(1.12)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.94)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'slow-zoom': {
          from: { transform: 'scale(1)' },
          to: { transform: 'scale(1.09)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '70%': { transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.2s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        blob: 'blob 14s ease-in-out infinite',
        marquee: 'marquee 45s linear infinite',
        'slow-zoom': 'slow-zoom 18s ease-in-out infinite alternate',
        shimmer: 'shimmer 5s linear infinite',
        'pop-in': 'pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};
