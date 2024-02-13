/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
  ],
  darkMode: 'class',
  theme: {
    screens: {
      mobile: { max: '767px' },
      tablet: { max: '1023px' },
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
      hd: '1920px',
    },

    colors: {
      primary: '#91331F',
      secondary: '#78DCE8',

      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#F0F2DA',
      yellow: '#F9FF73',
      orange: '#F7AF39',
      pink: '#FF6188',
      green: '#A9DC76',
      violet: '#AB9DF2',
      blue: '#73AEE5',
      discord: '#4554E9',
      
      lineup: '#CBAB25',
      konference: '#91331F',
      vstopnice: '#FF9D16',
      sprejemi: '#15D0AB',
      specialke: '#DD73DD',
      info: '#E9E8C4',

      body: '#9D9E91',
      bodyDark: '#6A6B63',

      bg: {
        lightest: '#F4F4EA',
        lighter: '#313442',
        light: '#1E212B',
        DEFAULT: '#CBAB25',
        dark: '#06080F',
      },
    },

    fontFamily: {
      inter: ['Inter', 'ui-sans-serif', 'system-ui'],
      newSpirit: ['New Spirit', 'ui-sans-serif', 'system-ui'],
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },

    container: {
      center: true,
      screens: {
        lx: '1440px',
      },
      padding: {
        DEFAULT: '1rem',
      },
    },

    extend: {
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
