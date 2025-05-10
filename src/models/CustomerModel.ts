// models/Customer.ts

// Customer interface
export interface Customer {
  CustomerID: string;
  FullName: string;
  ContactNo?: string;
  EmailAddress: string;
  Address?: string;
  Password: string;
}

export interface CustomerInput {
  name: string;
  contactNumber?: string;
  email: string;
  address?: string;
  password: string;
}

