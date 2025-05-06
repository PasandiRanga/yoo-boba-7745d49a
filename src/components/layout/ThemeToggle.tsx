
import { AnimatedSwitch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <AnimatedSwitch 
      checked={theme === "dark"} 
      onChange={toggleTheme} 
      aria-label="Toggle theme"
    />
  );
}
