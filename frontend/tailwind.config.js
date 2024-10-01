/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    darkMode: "class",
    extend: {},
  },
  plugins: [],
  darkMode: "class",
  variants: {
    extend: {
      opacity: ["group", "group-hover"],
    },
  },
}

