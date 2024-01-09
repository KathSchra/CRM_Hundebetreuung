/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#38bdf8",
          "secondary": "#a3e635",
          "accent": "#fbbf24",
          "neutral": "#040424",
          "base-100": "#f2f2f2",
          "info": "#808080",
          "success": "#36d399",
          "warning": "#ea580c",
          "error": "#dc2626",
          
        },
      },
    ],
  },
};
