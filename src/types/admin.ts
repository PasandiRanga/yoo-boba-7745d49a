export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
  name: string;
  quantity: number;
  price: number;
  weight?: string;
}

export interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  customer: CustomerInfo;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

export interface ProductAttributes {
  color: string;
  flavor: string;
  texture: string;
  cookingTime: string;
  ingredients: string[];
  storageInstructions: string;
}

export interface ProductVariant {
  weight: string;
  price: number;
  stock: number;
}

export interface Product {
  product_id: string;
  name: string;
  description: string;
  images: string;
  attributes: ProductAttributes;
  featured: boolean;
  variants: ProductVariant[];
}

export interface NewProduct {
  productId: string;
  name: string;
  description: string;
  images: string;
  attributes: ProductAttributes;
  featured: boolean;
  variants: ProductVariant[];
}

export interface PriceUpdateDialog {
  open: boolean;
  productId: string;
  weight: string;
  currentPrice: number;
}

export interface StockUpdateDialog {
  open: boolean;
  productId: string;
  weight: string;
  currentStock: number;
}