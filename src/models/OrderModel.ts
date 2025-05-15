// src/models/OrderModel.ts - Updated to work with payment integration
import { v4 as uuidv4 } from 'uuid';

// Types
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface AddressInfo {
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
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  shippingAddress: AddressInfo;
  billingAddress: AddressInfo;
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
}

// Store orders in memory while in development
// In production, these would be stored in a database
const orders: Order[] = [];

// Create a new order
export const createOrder = (
  customer: CustomerInfo,
  shippingAddress: AddressInfo,
  billingAddress: AddressInfo,
  items: OrderItem[],
  paymentMethod: string
): Order => {
  // Calculate order total
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Create order object
  const order: Order = {
    id: uuidv4(),
    customer,
    shippingAddress,
    billingAddress,
    items,
    total,
    status: "pending",
    paymentMethod,
    paymentStatus: "pending",
    createdAt: new Date(),
  };

  // Store order in memory
  orders.push(order);

  // Also store in localStorage for persistence during development
  saveOrdersToLocalStorage();

  return order;
};

// Get order by ID
export const getOrderById = (id: string): Order | undefined => {
  loadOrdersFromLocalStorage();
  return orders.find((order) => order.id === id);
};

// Get orders for a customer
export const getOrdersByCustomerEmail = (email: string): Order[] => {
  loadOrdersFromLocalStorage();
  return orders.filter((order) => order.customer.email === email);
};

// Update order payment status
export const updateOrderPaymentStatus = (
  orderId: string,
  paymentStatus: string
): Order | undefined => {
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return undefined;

  orders[orderIndex].paymentStatus = paymentStatus;
  
  // Update order status based on payment status
  if (paymentStatus === "completed") {
    orders[orderIndex].status = "processing";
  } else if (paymentStatus === "failed") {
    orders[orderIndex].status = "payment_failed";
  }

  saveOrdersToLocalStorage();
  return orders[orderIndex];
};

// Helper functions for local storage persistence
const saveOrdersToLocalStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("orders", JSON.stringify(orders));
  }
};

const loadOrdersFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      // Clear current orders array
      orders.length = 0;
      // Push all stored orders
      const parsedOrders = JSON.parse(storedOrders);
      parsedOrders.forEach((order: Order) => {
        orders.push({
          ...order,
          createdAt: new Date(order.createdAt)
        });
      });
    }
  }
};

// Initialize by loading orders from localStorage
loadOrdersFromLocalStorage();