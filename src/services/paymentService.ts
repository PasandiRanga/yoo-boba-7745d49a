// File: src/services/paymentService.ts

import { OrderItem } from '@/models/OrderModel';

// Base API URL - adjust this to match your backend API
const API_URL = 'http://localhost:4000/api';

export interface CustomerInfo {
  id?: string;
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

export interface PaymentInitializeRequest {
  orderId: string;
  amount: number;
  customer: CustomerInfo;
  shippingAddress: AddressInfo;
  billingAddress: AddressInfo;
  items: OrderItem[];
}

export interface PaymentData {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  amount: string;
  currency: string;
  hash: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface PaymentInitializeResponse {
  success: boolean;
  paymentData: PaymentData;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: string;
  paymentReference?: string;
}

// Initialize payment with PayHere
export const initializePayment = async (paymentData: PaymentInitializeRequest): Promise<PaymentInitializeResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    // Check for non-2xx responses
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response from server:', errorData);
      throw new Error(`Failed to initialize payment: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};

// Get payment status by order ID
export const getPaymentStatus = async (orderId: string): Promise<PaymentStatusResponse> => {
  try {
    const response = await fetch(`${API_URL}/payments/status/${orderId}`);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error response from server:', errorData);
      throw new Error(`Failed to fetch payment status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching payment status for order ${orderId}:`, error);
    throw error;
  }
};