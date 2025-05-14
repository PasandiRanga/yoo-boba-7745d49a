import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCartStorage } from "@/hooks/useCartStorage";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { storedItems, storeItems } = useCartStorage();
  const [items, setItems] = useState<CartItem[]>(storedItems);

  // Save to localStorage whenever items change
  useEffect(() => {
    storeItems(items);
  }, [items, storeItems]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        toast({
          title: "Item quantity updated",
          description: `${item.name} quantity increased to ${existingItem.quantity + item.quantity}`,
        });
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart`,
      });
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === id);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart`,
        });
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};