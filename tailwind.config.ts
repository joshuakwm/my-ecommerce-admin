import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
	'background-light': '#F7F9FC',
        'background-dark': '#121212',
        'primary-accent': '#4CAF50',
        'secondary-accent': '#FFC107',
        'text-light': '#2C2C2C',
        'text-dark': '#FFFFFF',
        'header-light': '#333333',
        'header-dark': '#EAEAEA',
        'link-light': '#007BFF',
        'link-dark': '#80BFFF',
        'card-light': '#FFFFFF',
        'card-dark': '#1E1E1E',
        'footer-light': '#F1F3F6',
        'footer-dark': '#181818',
        'secondary-100': '#F1F3F6',
        'secondary-800': '#1E1E1E',

      },
    },
  },
  plugins: [],
} satisfies Config;
