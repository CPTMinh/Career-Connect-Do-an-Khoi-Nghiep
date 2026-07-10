/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Màu thương hiệu tạm thời của Career Connect — chỉnh lại khi có brand kit
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
      },
    },
  },
  plugins: [],
};
