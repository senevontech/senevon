/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",   // slate-900
        secondary: "#38bdf8", // sky-400
        accent: "#f97316",    // orange-500
      },
      fontFamily: {
        brand: ["Pixel"],
        // sans: ["Inter", "system-ui", "sans-serif"],
        // display: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
