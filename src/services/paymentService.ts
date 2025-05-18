import { PaymentMethod, PaymentStatus } from '@/models/OrderModel';

// Base API URL - adjust this to your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Get PayHere checkout parameters
export const getPaymentCheckoutParams = async (orderId: string): Promise<Record<string, string>> => {
  try {
    const response = await fetch(`${API_URL}/payments/checkout-params/${orderId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to get payment parameters: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting payment parameters:', error);
    throw error;
  }
};

// Verify payment status
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

// Process payment through PayHere
export const processPayment = async (
  orderId: string, 
  paymentMethod: PaymentMethod = 'payhere'
): Promise<void> => {
  try {
    // Step 1: Get payment parameters with security hash from backend
    const paymentParams = await getPaymentCheckoutParams(orderId);
    
    // Step 2: Create and submit form to payment gateway
    if (paymentMethod === 'payhere') {
      // Create form for PayHere
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout';
      
      // Add all parameters to the form
      Object.entries(paymentParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      
      // Add form to document body and submit
      document.body.appendChild(form);
      form.submit();
    } else {
      throw new Error(`Payment method ${paymentMethod} not supported`);
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};