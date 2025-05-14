import { useCallback } from "react";
import type { CartItem } from "@/context/CartContext";

const CART_STORAGE_KEY = "yooboba-cart-items";

interface UseCartStorageReturn {
  storedItems: CartItem[];
  storeItems: (items: CartItem[]) => void;
  clearStoredItems: () => void;
}

export const useCartStorage = (): UseCartStorageReturn => {
  // Get items from localStorage
  const storedItems = (() => {
    if (typeof window === "undefined") return [];
    
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      return storedItems ? JSON.parse(storedItems) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage:", error);
      return [];
    }
  })();

  // Store items to localStorage
  const storeItems = useCallback((items: CartItem[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to store cart items to localStorage:", error);
      }
    }
  }, []);

  // Clear items from localStorage
  const clearStoredItems = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear cart items from localStorage:", error);
      }
    }
  }, []);

  return {
    storedItems,
    storeItems,
    clearStoredItems,
  };
};