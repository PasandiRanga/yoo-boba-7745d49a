
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fillCup": "fillCup 4s ease-in-out forwards",
        "rise": "rise 4s infinite ease-in-out",
        "riseDelay1": "rise 4s infinite ease-in-out 0.5s",
        "riseDelay2": "rise 4s infinite ease-in-out 1s",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "scale-in": "scaleIn 0.3s ease-in-out",
        "slide-in-right": "slideInRight 0.5s ease-in-out",
      },
      keyframes: {
        fillCup: {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
        rise: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        }
      },
      colors: {
        'yooboba-blue': '#5B6DF8',
        'yooboba-purple': '#9b87f5',
        'yooboba-pink': '#F870C5',
      },
      backgroundImage: {
        'yooboba-gradient': 'linear-gradient(90deg, #5B6DF8 0%, #9B87F5 50%, #F870C5 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 5px 2px rgba(155, 135, 245, 0.3)',
      }
    },
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
} satisfies Config;
