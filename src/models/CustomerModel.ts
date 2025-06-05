// models/Customer.ts

// Customer interface
export interface Customer {
  FullName: string;
  ContactNo?: string;
  Address?: string;
  Password: string;
  customerid: string;
  emailaddress: string;
}

export interface CustomerInput {
  name: string;
  contactNumber?: string;
  email: string;
  address?: string;
  password: string;
}

export interface CustomerCheckout {
  customerid: string;
  first_name: string;
  last_name: string;
  emailaddress: string;
  contactno: string;
  company?: string;
  userId?: string; // Will be null for guest users
  address: Address;
}

// Define Address interface if not already defined or import it from the correct file
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

