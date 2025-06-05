import { createContext, ReactNode, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";
import { useCartStorage } from "@/hooks/useCartStorage";
import { cartService, isUserLoggedIn, getCurrentCustomerId } from "@/services/cartService";

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
  removeOrderedItems: (orderedItems: CartItem[]) => void;
  totalItems: number;
  subtotal: number;
  selectedItems: SelectedItems;
  toggleItemSelection: (id: string) => void;
  toggleSelectAll: (isSelected: boolean) => void;
  selectedSubtotal: number;
  getSelectedItems: () => CartItem[];
  selectedItemsCount: number;
  isLoading: boolean;
  syncCartOnLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Extract the provider component to make it Fast Refresh compatible
function CartProvider({ children }: { children: ReactNode }) {
  const { storedItems, storeItems, clearStoredItems } = useCartStorage();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});

  // Helper function to initialize selected items
  const initializeSelectedItems = useCallback((cartItems: CartItem[]) => {
    const initialSelectedState: SelectedItems = {};
    cartItems.forEach(item => {
      initialSelectedState[item.id] = true;
    });
    setSelectedItems(initialSelectedState);
  }, []);

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      try {
        if (isUserLoggedIn()) {
          // User is logged in, fetch from database
          const customerId = getCurrentCustomerId();
          console.log('Current customer ID1:', customerId);
          if (customerId) {
            const dbItems = await cartService.getCartItems(customerId);
            setItems(dbItems);
            initializeSelectedItems(dbItems);
          }
        } else {
          // User not logged in, use localStorage
          setItems(storedItems);
          initializeSelectedItems(storedItems);
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Fallback to localStorage if database fetch fails
        setItems(storedItems);
        initializeSelectedItems(storedItems);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeCart();
  }, []); // Empty dependency array - only run once on mount

  // Listen for auth events and react accordingly
  useEffect(() => {
    const handleAuthLogin = async () => {
      console.log('Auth login event detected, syncing cart...');
      await syncCartOnLogin();
    };

    const handleAuthLogout = async () => {
      console.log('Auth logout event detected, switching to localStorage cart...');
      setIsLoading(true);
      try {
        // Switch back to localStorage cart
        setItems(storedItems);
        initializeSelectedItems(storedItems);
      } catch (error) {
        console.error('Error handling logout:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add event listeners
    window.addEventListener('auth-login', handleAuthLogin);
    window.addEventListener('auth-logout', handleAuthLogout);

    // Cleanup
    return () => {
      window.removeEventListener('auth-login', handleAuthLogin);
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, [storedItems, initializeSelectedItems]);

  // Save to localStorage only when user is not logged in
  useEffect(() => {
    if (isInitialized && !isUserLoggedIn()) {
      storeItems(items);
    }
  }, [items, storeItems, isInitialized]);

  // Sync cart when user logs in - IMPROVED VERSION
  const syncCartOnLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      const customerId = getCurrentCustomerId();
      if (!customerId) {
        throw new Error('No customer ID found after login');
      }

      // Get current localStorage items
      const localStorageItems = storedItems;
      
      if (localStorageItems.length > 0) {
        // Sync localStorage cart to database
        console.log('Syncing cart items:', localStorageItems);
        await cartService.syncCart(customerId, localStorageItems);
        
        // Clear localStorage after successful sync
        clearStoredItems();
        
        toast({
          title: "Cart synced",
          description: "Your cart has been synchronized with your account",
        });
      }

      // Always fetch updated cart from database after login
      const dbItems = await cartService.getCartItems(customerId);
      console.log('Fetched cart items from database:', dbItems);
      
      setItems(dbItems);
      initializeSelectedItems(dbItems);
      
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync cart with your account",
        variant: "destructive"
      });
      
      // If sync fails, still try to fetch user's existing cart
      try {
        const customerId = getCurrentCustomerId();
        if (customerId) {
          const dbItems = await cartService.getCartItems(customerId);
          setItems(dbItems);
          initializeSelectedItems(dbItems);
        }
      } catch (fetchError) {
        console.error('Error fetching cart after sync failure:', fetchError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [storedItems, clearStoredItems, initializeSelectedItems]);

  const addItem = useCallback(async (item: CartItem) => {
    setIsLoading(true);
    try {
      if (isUserLoggedIn()) {
        console.log('Adding item to cart in database:', item);
        // Add to database
        const customerId = getCurrentCustomerId();
        console.log('Current customer ID:', customerId);
        if (customerId) {
          await cartService.addToCart(customerId, item);
          
          // Refresh cart from database
          const updatedItems = await cartService.getCartItems(customerId);
          setItems(updatedItems);
          
          // Mark new item as selected
          setSelectedItems(prev => ({
            ...prev,
            [item.id]: true
          }));
        }
      } else {
        // Add to localStorage
        setItems((prevItems) => {
          const existingItem = prevItems.find((i) => i.id === item.id);
          if (existingItem) {
            return prevItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          }
          
          return [...prevItems, item];
        });
        
        // Mark new item as selected
        setSelectedItems(prev => ({
          ...prev,
          [item.id]: true
        }));
      }
      
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Updated removeItem function with better error handling
  const removeItem = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      if (isUserLoggedIn()) {
        // Remove from database
        const customerId = getCurrentCustomerId();
        if (customerId) {
          try {
            await cartService.removeCartItem(customerId, id);
          } catch (error: unknown) {
            // If item doesn't exist in database (404), just continue with local removal
            if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message?: string }).message === "string" &&
                ((error as { message: string }).message.includes('404') || (error as { message: string }).message.includes('not found'))) {
              console.warn(`Item ${id} not found in database, removing from local state only`);
            } else {
              throw error; // Re-throw other errors
            }
          }
          
          // Always update local state regardless of database operation result
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
      } else {
        // Remove from localStorage
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
      
      // Remove from selected items
      setSelectedItems(prev => {
        const updated = {...prev};
        delete updated[id];
        return updated;
      });
      
      const itemToRemove = items.find((i) => i.id === id);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} has been removed from your cart`,
        });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      
      // For critical errors, still try to remove from local state as fallback
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setSelectedItems(prev => {
        const updated = {...prev};
        delete updated[id];
        return updated;
      });
      
      toast({
        title: "Warning",
        description: "Item removed locally, but there may have been a sync issue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  // Also update the updateQuantity function for similar robustness
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    setIsLoading(true);
    try {
      if (isUserLoggedIn()) {
        // Update in database
        const customerId = getCurrentCustomerId();
        if (customerId) {
          try {
            await cartService.updateCartItem(customerId, id, quantity);
          } catch (error: unknown) {
            // If item doesn't exist in database, add it instead
            if (
              typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof (error as { message?: string }).message === "string" &&
              (
                (error as { message: string }).message.includes('404') ||
                (error as { message: string }).message.includes('not found')
              )
            ) {
              const itemToUpdate = items.find(item => item.id === id);
              if (itemToUpdate) {
                console.warn(`Item ${id} not found in database, adding it`);
                await cartService.addToCart(customerId, { ...itemToUpdate, quantity });
              }
            } else {
              throw error;
            }
          }
          
          // Update local state
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            )
          );
        }
      } else {
        // Update in localStorage
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      
      // Fallback: update local state anyway
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
      
      toast({
        title: "Warning",
        description: "Quantity updated locally, but there may have been a sync issue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [items]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isUserLoggedIn()) {
        // Clear database cart
        const customerId = getCurrentCustomerId();
        if (customerId) {
          await cartService.clearCart(customerId);
        }
      }
      
      // Clear local state
      setItems([]);
      setSelectedItems({});
      
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeOrderedItems = useCallback(async (orderedItems: CartItem[]) => {
    setIsLoading(true);
    try {
      if (isUserLoggedIn()) {
        // Remove from database
        const customerId = getCurrentCustomerId();
        if (customerId) {
          await cartService.removeOrderedItems(customerId, orderedItems);
          
          // Refresh cart from database
          const updatedItems = await cartService.getCartItems(customerId);
          setItems(updatedItems);
          
          // Update selected items state
          setSelectedItems(prev => {
            const updated = { ...prev };
            orderedItems.forEach(orderedItem => {
              const cartItem = items.find(item => item.id === orderedItem.id);
              if (cartItem && cartItem.quantity <= orderedItem.quantity) {
                delete updated[orderedItem.id];
              }
            });
            return updated;
          });
        }
      } else {
        // Remove from localStorage
        setItems((prevItems) => {
          const updatedItems = prevItems.map(cartItem => {
            const orderedItem = orderedItems.find(ordered => ordered.id === cartItem.id);
            
            if (orderedItem) {
              const remainingQuantity = cartItem.quantity - orderedItem.quantity;
              
              if (remainingQuantity <= 0) {
                return null;
              } else {
                return { ...cartItem, quantity: remainingQuantity };
              }
            }
            
            return cartItem;
          }).filter(item => item !== null) as CartItem[];

          return updatedItems;
        });
        
        // Update selected items state
        setSelectedItems(prev => {
          const updated = { ...prev };
          orderedItems.forEach(orderedItem => {
            const cartItem = items.find(item => item.id === orderedItem.id);
            if (cartItem && cartItem.quantity <= orderedItem.quantity) {
              delete updated[orderedItem.id];
            }
          });
          return updated;
        });
      }
      
      const removedItemsCount = orderedItems.length;
      toast({
        title: "Order completed",
        description: `${removedItemsCount} ordered item${removedItemsCount > 1 ? 's have' : ' has'} been removed from your cart`,
      });
    } catch (error) {
      console.error('Error removing ordered items:', error);
      toast({
        title: "Error",
        description: "Failed to remove ordered items from cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [items]);

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

  const selectedSubtotal = useMemo(() => 
    items.reduce((total, item) => {
      if (selectedItems[item.id]) {
        return total + (item.price * item.quantity);
      }
      return total;
    }, 0),
    [items, selectedItems]
  );

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
    removeOrderedItems,
    totalItems,
    subtotal,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    selectedSubtotal,
    getSelectedItems,
    selectedItemsCount,
    isLoading,
    syncCartOnLogin
  }), [
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    removeOrderedItems,
    totalItems,
    subtotal,
    selectedItems,
    toggleItemSelection,
    toggleSelectAll,
    selectedSubtotal,
    getSelectedItems,
    selectedItemsCount,
    isLoading,
    syncCartOnLogin
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Extract the hook to make it Fast Refresh compatible
function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Named exports for better Fast Refresh compatibility
export { CartProvider, useCart };