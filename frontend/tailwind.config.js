/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        academy: {
          ink: "#17202a",
          blue: "#2563eb",
          cyan: "#06b6d4",
          green: "#16a34a",
          paper: "#f8fafc"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
