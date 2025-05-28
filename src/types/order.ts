export interface DatabaseOrderResponse {
  order: {
    id: string;
    customer: {
      id: number;
      order_id: string;
      first_name: string;
      last_name: string;
      email: string;
      emailaddress: string;
      contactno: string;
      phone: string;
      company?: string;
      user_id?: string;
    };
    shippingAddress: {
      id: number;
      order_id: string;
      address_type: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingAddress: {
      id: number;
      order_id: string;
      address_type: string;
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    items: Array<{
      id: number;
      order_id: string;
      product_id: string;
      name: string;
      price: string;
      quantity: number;
    }>;
    total_amount: string;
    status: string;
    payment_method: string;
    payment_status: string;
    payment_id?: string;
    created_at: string;
    updated_at: string;
    is_guest_order: boolean;
  };
}

export interface Order {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company?: string;
    userId?: string;
  };
  shippingAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
  isGuestOrder: boolean;
}

export type Address = {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}; 