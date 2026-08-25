import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* One typeface site-wide — `font-heading` / `font-body` / `font-label`
         are kept as separate tokens purely so intent stays readable in the
         markup; all three resolve to Jost. */
      fontFamily: {
        heading: ["var(--font-jost)", "system-ui", "sans-serif"],
        body: ["var(--font-jost)", "system-ui", "sans-serif"],
        label: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#4E5426",
          sand: "#E3CC9D",
        },
        ink: {
          DEFAULT: "#1E2115",
          secondary: "#5F6352",
          muted: "#8A8D80",
        },
        hairline: "#E3CC9D",
      },
    },
  },
  plugins: [],
};

export default config;
