import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "light-brown": "#F5E6D3",
        "royal-blue": "#2563EB",
        "deep-navy": "#1E3A8A",
        "kalahari-gold": "#FFD700",
      },
      fontFamily: {
        sans: ["Inter", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backdropBlur: {
        sm: "4px",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
