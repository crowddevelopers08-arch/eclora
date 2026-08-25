import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      colors: {
        brand: {
          DEFAULT: "#4E532B",
          dark: "#3D4222",
          olive: "#737852",
          tint: "#EEF0E7",
        },
        surface: {
          white: "#FFFFFF",
          warm: "#FAFAF7",
          cream: "#F6F6F0",
          section: "#F1F2EB",
          hover: "#E9EBDD",
        },
        ink: {
          DEFAULT: "#1E2115",
          secondary: "#5F6352",
          muted: "#8A8D80",
        },
        hairline: "#E2E4DA",
      },
    },
  },
  plugins: [],
};

export default config;
