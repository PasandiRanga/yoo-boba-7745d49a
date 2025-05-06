
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { DollarSign, IndianRupee } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CurrencyToggle = () => {
  const { currency, toggleCurrency, isLoading } = useCurrency();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCurrency}
            disabled={isLoading}
            className="relative hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {currency === "LKR" ? (
              <IndianRupee className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <DollarSign className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {currency === "LKR" ? "USD" : "LKR"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CurrencyToggle;
