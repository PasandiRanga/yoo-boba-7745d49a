
import React from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyToggle() {
  const { currency, toggleCurrency } = useCurrency();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleCurrency}
      className="rounded-full text-xs h-8 px-3 bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
    >
      {currency === "LKR" ? "Switch to USD" : "Switch to LKR"}
    </Button>
  );
}
