import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type CurrencyType = "LKR" | "USD";

interface CurrencyContextType {
  currency: CurrencyType;
  exchangeRate: number;
  toggleCurrency: () => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>("LKR");
  const [exchangeRate, setExchangeRate] = useState<number>(320); // Default fallback rate 1 USD = 320 LKR
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch exchange rate when component mounts
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      setIsLoading(true);
      // Using ExchangeRate API to get real-time LKR to USD exchange rate
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await response.json();
      
      if (data && data.rates && data.rates.LKR) {
        setExchangeRate(data.rates.LKR);
        console.log("Exchange rate fetched:", data.rates.LKR);
      }
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // Keep the fallback rate if fetch fails
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCurrency = () => {
    setCurrency(currency === "LKR" ? "USD" : "LKR");
  };

  // Convert price based on the selected currency
  const convertPrice = (price: number): number => {
    if (currency === "LKR") {
      return price;
    } else {
      return price / exchangeRate;
    }
  };

  // Format price with the appropriate currency symbol
  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    if (currency === "LKR") {
      return new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2
      }).format(convertedPrice);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(convertedPrice);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        exchangeRate,
        toggleCurrency,
        convertPrice,
        formatPrice,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
