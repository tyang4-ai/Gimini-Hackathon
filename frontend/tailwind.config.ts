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
        // Apple-style light palette
        // Backgrounds
        background: "#FFFFFF",
        surface: "#F5F5F7",
        elevated: "#FBFBFD",
        border: "#E8E8ED",

        // Legacy aliases for easier migration
        void: "#FFFFFF",

        // Accent colors (Apple-inspired)
        "accent-blue": "#0071E3",
        "accent-teal": "#00C7BE",
        "accent-orange": "#FF9500",
        "accent-violet": "#AF52DE",
        "accent-green": "#34C759",

        // Legacy accent aliases
        gold: "#FF9500",
        violet: "#AF52DE",
        teal: "#00C7BE",
        rose: "#FF6B8A",
        ice: "#5AC8FA",
        cream: "#FFE6FA",

        // Text colors
        text: {
          primary: "#1D1D1F",
          secondary: "#86868B",
          muted: "#515154",
          // Legacy aliases
          lore: "#FF9500",
          whisper: "#00C7BE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        whisper: ["var(--font-whisper)", "Crimson Text", "serif"],
      },
      boxShadow: {
        // Apple-style subtle shadows (replacing glows)
        "card": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.12)",
        "elevated": "0 8px 24px rgba(0, 0, 0, 0.12)",
        "modal": "0 16px 48px rgba(0, 0, 0, 0.16)",

        // Accent shadows for special states
        "accent-teal": "0 4px 16px rgba(0, 199, 190, 0.25)",
        "accent-orange": "0 4px 16px rgba(255, 149, 0, 0.25)",
        "accent-violet": "0 4px 16px rgba(175, 82, 222, 0.25)",

        // Legacy aliases (mapped to new shadows)
        "glow-gold": "0 4px 16px rgba(255, 149, 0, 0.25)",
        "glow-violet": "0 4px 16px rgba(175, 82, 222, 0.25)",
        "glow-teal": "0 4px 16px rgba(0, 199, 190, 0.25)",
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
