import { useState, useEffect } from 'react';

declare global {
  interface Window {
    clearCart?: () => void;
  }
}

/**
 * Custom hook to manage shopping cart state
 */
export const useCart = () => {
  // State to hold cart items
  const [cart, setCart] = useState([]);
  
  // Cart total
  const [cartTotal, setCartTotal] = useState(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        calculateTotal(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    calculateTotal(cart);
    
    // Expose cart clearing function for use after checkout
    window.clearCart = clearCart;
    
    // Cleanup
    return () => {
      delete window.clearCart;
    };
  }, [cart]);
  
  // Calculate total price of all items in cart
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    );
    setCartTotal(total);
  };
  
  // Add item to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };
  
  // Update item quantity in cart
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };
  
  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  
  return {
    cart,
    cartTotal,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount: cart.reduce((count, item) => count + item.quantity, 0)
  };
};

export default useCart;