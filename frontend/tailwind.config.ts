import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Celestial Dreams palette
        void: "#1c2541",
        surface: "#3a506b",
        elevated: "#4a5568",
        gold: "#ffd66b",
        violet: "#7f5af0",
        teal: "#5bc0be",
        rose: "#ff8cc6",
        ice: "#b7f0ff",
        cream: "#ffe6fa",
        // Text colors
        text: {
          primary: "#ffffff",
          secondary: "#b7c5d3",
          muted: "#6b7a8a",
          lore: "#ffd66b",
          whisper: "#b7f0ff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        whisper: ["var(--font-whisper)", "Crimson Text", "serif"],
      },
      boxShadow: {
        "glow-gold": "0 0 20px rgba(255, 214, 107, 0.5)",
        "glow-violet": "0 0 20px rgba(127, 90, 240, 0.5)",
        "glow-teal": "0 0 15px rgba(91, 192, 190, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
