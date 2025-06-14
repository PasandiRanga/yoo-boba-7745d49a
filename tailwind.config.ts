
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
        'yooboba-blue': '#00c3ff',
        'yooboba-light': '#e0f7fa',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
