import type { Config } from "tailwindcss";

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "light-brown": "var(--light-brown)",
        "royal-blue": "var(--royal-blue)",
        "deep-navy": "var(--deep-navy)",
        "kalahari-gold": "var(--kalahari-gold)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        serif: ["var(--font-playfair)"],
      },
      boxShadow: {
        subtle: "0 10px 30px -15px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
