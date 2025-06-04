import { Customer , CustomerCheckout } from '@/models/CustomerModel';

// Base API URL - adjust this to your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Fetch all customers
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_URL}/customers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customers: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

// Fetch a single customer by ID
export const fetchCustomerById = async (id: string): Promise<CustomerCheckout> => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: customerData.FullName.split(' ')[0],
        last_name: customerData.FullName.split(' ').slice(1).join(' '),
        email: customerData.EmailAddress,
        phone: customerData.ContactNo,
        password: customerData.Password,
        address: customerData.Address,
        status: 'active',
        notes: ''
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create customer: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

// Update an existing customer
export const updateCustomer = async (id: string, customerData: Partial<Customer>): Promise<Customer> => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) {
      throw new Error(`Failed to update customer: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete customer: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    throw error;
  }
};

// Fetch customers by membership level
export const fetchCustomersByMembership = async (level: string): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_URL}/customers/membership/${level}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customers by membership level: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching customers with membership level ${level}:`, error);
    throw error;
  }
};

// Verify customer authentication
export async function loginCustomer(email, password) {
  try {
    const response = await fetch(`${API_URL}/customers/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Extract the error message from the response
      throw new Error(data.message || `Login failed: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error("Error logging in customer:", error);
    throw error;
  }
}