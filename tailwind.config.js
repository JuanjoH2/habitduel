/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f8f9ff",
        "secondary-fixed": "#6ffbbe",
        "surface-container": "#e5eeff",
        "primary-container": "#8455ef",
        "secondary-container": "#6cf8bb",
        primary: "#6b38d4",
        "on-surface": "#0b1c30",
        "surface-variant": "#d3e4fe",
        "outline-variant": "#cbc3d7",
        "on-surface-variant": "#494454",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "on-secondary-container": "#00714d",
        "on-primary-container": "#fffbff",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#002113",
        secondary: "#006c49",
        "on-secondary": "#ffffff",
        "on-secondary-fixed-variant": "#005236",
        outline: "#7b7486",
        "primary-fixed": "#e9ddff",
      },
      fontFamily: { lexend: ["Lexend", "sans-serif"] },
      spacing: {
        "section-gap": "32px",
        "element-gap": "16px",
        unit: "8px",
        "container-padding-mobile": "20px",
        "container-padding-desktop": "40px",
      },
      backgroundImage: {
        "soft-gradient":
          "radial-gradient(circle at top left, #e5eeff, #f8f9ff)",
      },
    },
  },
};
