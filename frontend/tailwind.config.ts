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
        background: "#FFFFFF",
        foreground: "#181C20",
        primary: "#004D40",
        "primary-light": "#00796B",
        "primary-dark": "#00342B",
        accent: "#FFC107",
        "accent-light": "#FFD54F",
        "accent-dark": "#FFA000",
        surface: "#FFFFFF",
        "surface-dim": "#F5F7F5",
        "on-surface": "#3F4945",
        outline: "#E0E0E0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        serif: [
          "var(--font-dm-serif)",
          "DM Serif Display",
          "Georgia",
          "serif",
        ],
      },
      borderRadius: {
        m3: "28px",
        "m3-sm": "16px",
        "m3-lg": "32px",
      },
      boxShadow: {
        m3: "0 4px 20px rgba(0,77,64,0.06)",
        "m3-hover": "0 20px 60px rgba(0,77,64,0.1), 0 8px 20px rgba(0,0,0,0.04)",
        glass: "0 8px 32px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in-right": "fadeInRight 1s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fadeIn 0.6s ease both",
        "float-rotate": "floatRotate 12s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
        "icon-float": "iconFloat 2.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "card-slide-up": "cardSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
