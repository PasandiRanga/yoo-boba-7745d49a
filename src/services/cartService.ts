// services/cartService.ts
import { CartItem } from "@/context/CartContext";

// Use import.meta.env for Vite or window.location for fallback
const API_BASE_URL = (() => {
  // For Vite (most modern React setups)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  }
  
  // For Create React App
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  }
  
  // Fallback - construct from current location
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const port = hostname === 'localhost' ? ':4000' : '';
    return `${protocol}//${hostname}${port}/api`;
  }
  
  // Final fallback
  return 'http://localhost:4000/api';
})();

// Get auth token from sessionStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('token');
};

// Get customer data from sessionStorage
const getCustomerData = () => {
  if (typeof window === 'undefined') return null;
  const customerData = sessionStorage.getItem('customer');
  console.log('Customer data from sessionStorage:', customerData);
  return customerData ? JSON.parse(customerData) : null;
};

// Create headers with auth token
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const cartService = {
  // Get cart items from database
  async getCartItems(customerId: string): Promise<CartItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${customerId}`, {
        method: 'GET',
        headers: createAuthHeaders()
      });

      // Handle 404 as empty cart (user has no cart items yet)
      if (response.status === 404) {
        console.log('No cart found for user, returning empty cart');
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.items || [];
      } else {
        throw new Error(data.message || 'Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      
      // If the error is a 404 (which we should have caught above), return empty array
      if (error instanceof Error && error.message.includes('404')) {
        console.log('Treating 404 as empty cart');
        return [];
      }
      
      throw error;
    }
  },

  // Add item to cart in database
  async addToCart(customerId: string, item: CartItem): Promise<void> {
    try {
      if (!customerId) {
        console.log('Customer ID is required to add item to cart');
      }
      if (!item || !item.id || !item.quantity || !item.price) {
        console.log('Item must have id, quantity, and price to be added to cart');
      }
      console.log('Adding item to cart');
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify({
          customerId,
          productId: item.id,
          quantity: item.quantity,
          pricePerItem: item.price,
          weight: item.weight || 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity in database
  async updateCartItem(customerId: string, productId: string, quantity: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify({
          customerId,
          productId,
          quantity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart in database
  async removeCartItem(customerId: string, productId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${customerId}/${productId}`, {
        method: 'DELETE',
        headers: createAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove cart item');
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },

  // Clear entire cart in database
  async clearCart(customerId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/clear/${customerId}`, {
        method: 'DELETE',
        headers: createAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // Sync localStorage cart to database when user logs in
  async syncCart(customerId: string, cartItems: CartItem[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/sync`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify({
          customerId,
          cartItems
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to sync cart');
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  },

  // Remove ordered items from cart after successful order
  async removeOrderedItems(customerId: string, orderedItems: CartItem[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove-ordered`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify({
          customerId,
          orderedItems
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to remove ordered items');
      }
    } catch (error) {
      console.error('Error removing ordered items:', error);
      throw error;
    }
  }
};

// Utility function to check if user is logged in
export const isUserLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = getAuthToken();
  const customer = getCustomerData();
  console.log('Token:', token);
  console.log('Customer:', customer);
  return !!(token && customer);
};

// Get current customer ID
export const getCurrentCustomerId = (): string | null => {
  if (typeof window === 'undefined') return null;
  const customer = getCustomerData();
  return customer?.customerid || null;
};