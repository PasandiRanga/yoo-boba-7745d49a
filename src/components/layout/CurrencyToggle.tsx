import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { DollarSign } from "lucide-react";

// Create a simplified version without the Tooltip that's causing issues
const CurrencyToggle = () => {
  const { currency, toggleCurrency, isLoading } = useCurrency();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCurrency}
      disabled={isLoading}
      className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Switch to ${currency === "LKR" ? "USD" : "LKR"}`}
    >
      {currency === "LKR" ? (
        <span className="text-gray-700 dark:text-gray-300 font-medium">Rs</span>
      ) : (
        <DollarSign className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </Button>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CurrencyToggle);

