
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
      },
      colors: {
        'yooboba-purple': '#9b87f5',
        'yooboba-pink': '#F870C5',
      },
      backgroundImage: {
        'yooboba-gradient': 'linear-gradient(90deg, #5B6DF8 0%, #9B87F5 50%, #F870C5 100%)',
      },
    },
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
} satisfies Config;
