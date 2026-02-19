import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07070b",
        panel: "#11111a",
        panelSoft: "#191926",
        accent: "#ff3d5a",
        accentAlt: "#21d4fd",
        text: "#f4f5f7",
        muted: "#a5a8b3"
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at 20% 20%, rgba(255,61,90,0.32), transparent 45%), radial-gradient(circle at 80% 0%, rgba(33,212,253,0.25), transparent 40%), linear-gradient(180deg, #0a0a10 0%, #07070b 100%)"
      },
      boxShadow: {
        glow: "0 8px 40px rgba(255,61,90,0.25)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" }
        }
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;


