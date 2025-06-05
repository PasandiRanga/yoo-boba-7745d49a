import { v4 as uuidv4 } from 'uuid';

// Type definitions
export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  customerid?: string; // Will be null for guest users
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
  id:number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  weight?: string;
}

export interface Order {
  id: string;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  created_at: Date;
  updatedAt: Date;
  isGuestOrder: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'payhere' | 'cash_on_delivery' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

/**
 * Helper: Load orders from localStorage
 */
const loadOrders = (): Order[] => {
  try {
    return JSON.parse(localStorage.getItem('pendingOrders') || '[]') as Order[];
  } catch (e) {
    console.error('Failed to parse pendingOrders from localStorage:', e);
    return [];
  }
};

/**
 * Helper: Save orders to localStorage
 */
const saveOrders = (orders: Order[]): void => {
  localStorage.setItem('pendingOrders', JSON.stringify(orders));
};

/**
 * Create a new order
 */
export const createOrder = (
  customer: Customer,
  shippingAddress: Address,
  billingAddress: Address,
  items: OrderItem[],
  payment_method: PaymentMethod
): Order => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const isGuestOrder = !customer.customerid;

  const order: Order = {
    id: uuidv4(),
    customer,
    shippingAddress,
    billingAddress,
    items,
    total_amount: total,
    status: 'pending',
    payment_method,
    paymentStatus: 'pending',
    created_at: new Date(),
    updatedAt: new Date(),
    isGuestOrder,
  };

  const orders = loadOrders();
  orders.push(order);
  saveOrders(orders);

  return order;
};

/**
 * Update order status
 */
export const updateOrderStatus = (
  orderId: string,
  status: OrderStatus
): Order | null => {
  const orders = loadOrders();
  const index = orders.findIndex(order => order.id === orderId);

  if (index === -1) return null;

  orders[index].status = status;
  orders[index].updatedAt = new Date();

  saveOrders(orders);
  return orders[index];
};

/**
 * Update payment status
 */
export const updatePaymentStatus = (
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentId?: string
): Order | null => {
  const orders = loadOrders();
  const index = orders.findIndex(order => order.id === orderId);

  if (index === -1) return null;

  orders[index].paymentStatus = paymentStatus;
  if (paymentId) orders[index].paymentId = paymentId;
  orders[index].updatedAt = new Date();

  saveOrders(orders);
  return orders[index];
};

/**
 * Get order by ID
 */
export const getOrderById = (orderId: string): Order | null => {
  const orders = loadOrders();
  return orders.find(order => order.id === orderId) || null;
};

/**
 * Get all orders
 */
export const getAllOrders = (): Order[] => {
  return loadOrders();
};

/**
 * Clear all orders (development use only)
 */
export const clearOrders = (): void => {
  localStorage.removeItem('pendingOrders');
};
