import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A1A2F", 2: "#0F2440" },
        ice: "#F5F8FB",
        paper: "#FFFFFF",
        gold: { DEFAULT: "#C9A227", soft: "#E4C76A" },
        celeste: { DEFAULT: "#6CB4E4", deep: "#3E8FD0" },
        steel: "#5B6B7C",
        line: "#E2E8EF",
        // Franja decorativa de 5 colores (NO los aros olímpicos)
        ribbon: {
          blue: "#0072CE",
          yellow: "#F4C300",
          black: "#1A1A1A",
          green: "#009F3D",
          red: "#DF0024",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Oswald", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
