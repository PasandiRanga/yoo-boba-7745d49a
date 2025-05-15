import { Order } from '@/models/OrderModel';

// Base API URL - adjust this to your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Fetch all orders
export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Fetch a single order by ID
export const fetchOrderById = async (id: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create order: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an existing order
export const updateOrder = async (id: string, orderData: Partial<Order>): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete order: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    throw error;
  }
};

// Fetch orders by customer ID
export const fetchOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders/customer/${customerId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders by customer: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    throw error;
  }
};

// Fetch orders by status
export const fetchOrdersByStatus = async (status: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders/status/${status}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders by status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    throw error;
  }
};

// Process payment for an order
interface PaymentData {
  amount: number;
  method: string;
  [key: string]: string | number; // Adjust this to the expected types of additional properties
}

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  [key: string]: unknown; // Adjust or replace with specific types if known
}

export const processOrderPayment = async (orderId: string, paymentData: PaymentData): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Payment processing failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error processing payment for order ${orderId}:`, error);
    throw error;
  }
};

// Verify payment status
interface PaymentVerificationResponse {
  status: string;
  verified: boolean;
  [key: string]: unknown; // Adjust or replace with specific types if known
}

export const verifyPaymentStatus = async (paymentId: string): Promise<PaymentVerificationResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/${paymentId}/verify`);
    if (!response.ok) {
      throw new Error(`Failed to verify payment: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error verifying payment ${paymentId}:`, error);
    throw error;
  }
};