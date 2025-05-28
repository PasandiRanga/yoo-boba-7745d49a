import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

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
  // Use localStorage to persist currency preference
  const savedCurrency = typeof window !== 'undefined' ? 
    (localStorage.getItem('currency') as CurrencyType || "LKR") : "LKR";
    
  const [currency, setCurrency] = useState<CurrencyType>(savedCurrency);
  const [exchangeRate, setExchangeRate] = useState<number>(320); // Default fallback rate
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false); // Track if we've already fetched

  // Fetch exchange rate only once on mount
  useEffect(() => {
    if (hasFetched) return; // Prevent duplicate requests
    
    let isMounted = true;
        
    const fetchExchangeRate = async () => {
      try {
        setIsLoading(true);
        // Using ExchangeRate API to get real-time LKR to USD exchange rate
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
                
        if (isMounted && data && data.rates && data.rates.LKR) {
          setExchangeRate(data.rates.LKR);
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        // Keep the fallback rate if fetch fails
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setHasFetched(true); // Mark as fetched regardless of success/failure
        }
      }
    };

    fetchExchangeRate();
        
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currency', currency);
    }
  }, [currency]);

  // Memoize toggleCurrency to maintain stable reference
  const toggleCurrency = useCallback(() => {
    console.log('Toggle currency called, current:', currency); // Debug log
    setCurrency(prev => {
      const newCurrency = prev === "LKR" ? "USD" : "LKR";
      console.log('Switching from', prev, 'to', newCurrency); // Debug log
      return newCurrency;
    });
  }, [currency]); // Include currency in dependencies for debugging

  // Memoize convertPrice to maintain stable reference
  const convertPrice = useCallback((price: number): number => {
    if (currency === "LKR") {
      return price;
    } else {
      return price / exchangeRate;
    }
  }, [currency, exchangeRate]);

  // Memoize formatPrice to maintain stable reference
  const formatPrice = useCallback((price: number): string => {
    const convertedPrice = currency === "LKR" ? price : price / exchangeRate;
        
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
  }, [currency, exchangeRate]);

  // Create a stable context value object with useMemo
  const contextValue = useMemo(() => ({
    currency,
    exchangeRate,
    toggleCurrency,
    convertPrice,
    formatPrice,
    isLoading
  }), [currency, exchangeRate, toggleCurrency, convertPrice, formatPrice, isLoading]);

  return (
    <CurrencyContext.Provider value={contextValue}>
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