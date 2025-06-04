// src/models/OrderModel.ts
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  userId?: string; // Will be null for guest users
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string; // Add optional image property
  weight?: string; // Add optional weight property
}

export interface Order {
  id: string;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  isGuestOrder: boolean;
}


export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'payhere' | 'cash_on_delivery' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Create a new order
 */
export const createOrder = (
  customer: Customer,
  shippingAddress: Address,
  billingAddress: Address,
  items: OrderItem[],
  paymentMethod: PaymentMethod
): Order => {
  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  // Check if this is a logged-in user order or guest order
  const isGuestOrder = !customer.userId;
  
  // Create an order object
  const order: Order = {
    id: uuidv4(),
    customer,
    shippingAddress,
    billingAddress,
    items,
    total,
    status: 'pending',
    paymentMethod,
    paymentStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    isGuestOrder
  };

  // Store the order in local storage temporarily (will be replaced with API call)
  const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
  pendingOrders.push(order);
  localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));

  return order;
};

/**
 * Update order status
 */
export const updateOrderStatus = (orderId: string, status: OrderStatus): Order | null => {
  // In a real app, this would be an API call
  const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
  const orderIndex = pendingOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  pendingOrders[orderIndex].status = status;
  pendingOrders[orderIndex].updatedAt = new Date();
  
  localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
  return pendingOrders[orderIndex];
};

/**
 * Update payment status
 */
export const updatePaymentStatus = (
  orderId: string, 
  paymentStatus: PaymentStatus, 
  paymentId?: string
): Order | null => {
  // In a real app, this would be an API call
  const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
  const orderIndex = pendingOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  pendingOrders[orderIndex].paymentStatus = paymentStatus;
  if (paymentId) {
    pendingOrders[orderIndex].paymentId = paymentId;
  }
  pendingOrders[orderIndex].updatedAt = new Date();
  
  localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
  return pendingOrders[orderIndex];
};

/**
 * Get order by ID
 */
export const getOrderById = (orderId: string): Order | null => {
  // In a real app, this would be an API call
  const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
  return pendingOrders.find(order => order.id === orderId) || null;
};