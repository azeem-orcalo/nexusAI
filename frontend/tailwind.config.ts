import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f5efe4",
        ink: "#201a16",
        ember: "#ff7a2f",
        wheat: "#e8d9bd",
        clay: "#b39067",
        forest: "#173228"
      },
      boxShadow: {
        glow: "0 25px 80px rgba(255, 122, 47, 0.18)"
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Inter", "Segoe UI", "sans-serif"]
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(255,122,47,0.18), transparent 34%), linear-gradient(135deg, rgba(32,26,22,0.98), rgba(23,50,40,0.98))"
      }
    }
  },
  plugins: []
};

export default config;
