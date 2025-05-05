
import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyType = "LKR" | "USD";

interface CurrencyContextType {
  currency: CurrencyType;
  toggleCurrency: () => void;
  formatPrice: (amount: number) => string;
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate from USD to LKR (this would ideally come from an API)
const DEFAULT_EXCHANGE_RATE = 325; // 1 USD = 325 LKR

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>(() => {
    const savedCurrency = localStorage.getItem("currency") as CurrencyType;
    return savedCurrency || "LKR"; // Default to LKR
  });

  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);

  useEffect(() => {
    localStorage.setItem("currency", currency);
    
    // Ideally, fetch the latest exchange rate from an API here
    // For now, we'll use a fixed rate
    // Example API fetch:
    /*
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data && data.rates && data.rates.LKR) {
          setExchangeRate(data.rates.LKR);
        }
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };
    
    fetchExchangeRate();
    */
  }, [currency]);

  const toggleCurrency = () => {
    setCurrency(prev => (prev === "LKR" ? "USD" : "LKR"));
  };

  const formatPrice = (amount: number) => {
    if (currency === "LKR") {
      return new Intl.NumberFormat('si-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2
      }).format(amount);
    } else {
      // Convert LKR to USD
      const usdAmount = amount / exchangeRate;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(usdAmount);
    }
  };

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        toggleCurrency, 
        formatPrice,
        exchangeRate
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
