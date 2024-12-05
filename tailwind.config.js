/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "scroll-left": "scroll-left 15s linear infinite",
      },
      keyframes: {
        "scroll-left": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blandoBlue: "var(--blandoBlue)",
      },
      fontFamily: {
        antique: "var(--font-antique)",
        regular: "var(--font-regular)",
        thin: "var(--font-thin)",
        ppbold: "var(--font-ppbold)",
        ppregular: "var(--font-ppregular)",
      },
    },
  },
  plugins: [],
};
