import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // SOLA palette — warm celestial dark
        bg: '#0A0A0F',
        surface: '#15161E',
        text: '#F1EDE5',
        muted: '#8E8780',
        hairline: '#1F1F26',
        gold: '#D7BD8E',
        rose: '#D89090',
        roseDim: '#9A6868',
        violet: '#8B86A2',
        blue: '#9BAEC2',
        quietRed: '#9A6868',
        cacao: '#1F1518',
      },
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        wordmark: '0.6em',
      },
    },
  },
  plugins: [],
};

export default config;
