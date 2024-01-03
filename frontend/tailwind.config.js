/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{vue,js,ts}', './pages/**/*.vue'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px',
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#2E2E2E',
      richblack: '#1B2626',
      trueblack: '#000000',
      gray: {
        DEFAULT: '#C4C4C4',
        border: '#D0D0D0',
        light: '#F6F7FA',
        lighter: '#FCFCFC',
        dark: '#656565',
        blue: '#7388A9',
      },
      blue: {
        DEFAULT: '#182A68',
        intense: '#1A69FF',
        light: '#588fe2',
      },
      red: {
        DEFAULT: '#F75A5A',
        intense: '#E61616',
      },
      green: {
        DEFAULT: '#16C123',
        intense: '#3FEB49',
        dark: '#0B2F2D',
      },
    },

    fontFamily: {
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
    },

    extend: {
      fontSize: {
        10: ['10px', 1.25],
      },
      zIndex: {
        1: 1,
        2: 2,
        3: 3,
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
