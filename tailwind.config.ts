import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        mythos: {
          orange: "#FF4D00",
          blue: "#007AFF",
          ash: "#0A0A0A",
          bone: "#EDEDED",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
      backdropBlur: {
        xs: "2px",
        "4xl": "72px",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "draw-sigil": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "flicker": "flicker 2s ease-in-out infinite",
        "draw-sigil": "draw-sigil 4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;