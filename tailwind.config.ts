import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          500: '#E33A90',
          600: '#CC1F7A',
          700: '#A31962',
          900: '#6E1143',
        },
        accent: {
          100: '#FDF2F8',
          400: '#F9A8D4',
          500: '#F472B6',
          600: '#EC4899',
        },
        ink: {
          900: '#1A1A1A',
          700: '#4B5563',
        },
        canvas: {
          0: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};

export default config;
