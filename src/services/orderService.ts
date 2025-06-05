import { Order, Customer, Address, OrderItem, PaymentMethod, OrderStatus, PaymentStatus } from '@/models/OrderModel';

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

// Create a pending order
export const createPendingOrder = async (orderData: {
  orderId: string;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  amount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
}): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/create-pending`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create pending order: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating pending order:', error);
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
    console.log(`Fetching orders for customer ID: ${customerId}`);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders by customer ID: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching orders with customer ID ${customerId}:`, error);
    throw error;
  }
};

// Fetch orders by status
export const fetchOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
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

// Verify payment
export const verifyPayment = async (paymentData: {
  orderId: string;
  paymentId: string;
  status: string;
}): Promise<{ success: boolean; paymentStatus: PaymentStatus; message?: string }> => {
  try {
    const response = await fetch(`${API_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to verify payment: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating status for order with id ${id}:`, error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (id: string, reason?: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error canceling order with id ${id}:`, error);
    throw error;
  }
};