// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flipTop: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(-90deg)" },
        },
        flipBottom: {
          "0%": { transform: "rotateX(90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
      },
      animation: {
        flipTop: "flipTop 0.3s ease-in forwards",
        flipBottom: "flipBottom 0.3s ease-out 0.3s forwards",
      },
    },
  },
  plugins: [],
};
