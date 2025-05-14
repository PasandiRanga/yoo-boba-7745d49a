import { createContext, ReactNode, useState, useContext, useEffect, useCallback, useMemo } from "react";
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

interface SelectedItems {
  [key: string]: boolean;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  selectedItems: SelectedItems;
  toggleItemSelection: (id: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  selectedSubtotal: number;
  getSelectedItems: () => CartItem[];
  selectedItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { storedItems, storeItems } = useCartStorage();
  const [items, setItems] = useState<CartItem[]>(storedItems);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>(() => {
    // Initialize selected items state once when component mounts
    const initialSelectedState: SelectedItems = {};
    storedItems.forEach(item => {
      initialSelectedState[item.id] = true;
    });
    return initialSelectedState;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    storeItems(items);
  }, [items, storeItems]);

  // This useEffect was causing the infinite loop - we'll handle selection differently
  // Instead of using useEffect to manage selected items, we'll handle it in our item operations
  
  const addItem = useCallback((item: CartItem) => {
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
      
      // Mark new item as selected by default
      setSelectedItems(prev => ({
        ...prev,
        [item.id]: true
      }));
      
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart`,
      });
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
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
    
    // Also remove from selected items
    setSelectedItems(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedItems({});
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  }, []);

  // Toggle item selection
  const toggleItemSelection = useCallback((id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }, []);

  // Toggle select all
  const toggleSelectAll = useCallback((isSelected: boolean) => {
    setSelectedItems(prev => {
      const newSelectedState = {...prev};
      items.forEach(item => {
        newSelectedState[item.id] = isSelected;
      });
      return newSelectedState;
    });
  }, [items]);

  // Get only selected items
  const getSelectedItems = useCallback((): CartItem[] => {
    return items.filter(item => selectedItems[item.id]);
  }, [items, selectedItems]);

  // Calculate derived values with useMemo to prevent recalculations
  const totalItems = useMemo(() => 
    items.reduce((acc, item) => acc + item.quantity, 0), 
    [items]
  );

  const subtotal = useMemo(() => 
    items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  // Calculate selected items subtotal
  const selectedSubtotal = useMemo(() => 
    items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0),
    [items, selectedItems]
  );

  // Count selected items
  const selectedItemsCount = useMemo(() => 
    Object.values(selectedItems).filter(Boolean).length,
    [selectedItems]
  );

  // Create a stable context value
  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    selectedSubtotal,
    getSelectedItems,
    selectedItemsCount
  }), [
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    selectedSubtotal,
    getSelectedItems,
    selectedItemsCount
  ]);

  return (
    <CartContext.Provider value={contextValue}>
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