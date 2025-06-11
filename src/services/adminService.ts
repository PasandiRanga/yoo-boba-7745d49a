const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface AdminLoginData {
  email: string;
  password: string;
}

export interface AdminRegisterData {
  name: string;
  email: string;
  address: string;
  password: string;
}

export interface UpdateOrderStatusData {
  status: string;
}

export interface UpdateStockData {
  productId: string;
  weight: string;
  stock: number;
}

export interface UpdatePriceData {
  productId: string;
  weight: string;
  price: number;
}

export interface AddProductData {
  productId: string;
  name: string;
  description: string;
  images: string;
  attributes: any;
  featured: boolean;
  variants: Array<{
    weight: string;
    price: number;
    stock: number;
  }>;
}

// Authentication
export const adminLogin = async (data: AdminLoginData) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return await response.json();
};

export const adminRegister = async (data: AdminRegisterData) => {
  const response = await fetch(`${API_URL}/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
};

// Orders
export const fetchAllOrdersForAdmin = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/orders`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return await response.json();
};

export const updateOrderStatus = async (orderId: string, data: UpdateOrderStatusData, token: string) => {
  const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }

  return await response.json();
};

// Products
export const fetchAllProductsWithDetails = async (token: string) => {
  const response = await fetch(`${API_URL}/admin/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return await response.json();
};

export const updateProductStock = async (data: UpdateStockData, token: string) => {
  const response = await fetch(`${API_URL}/admin/products/stock`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update stock');
  }

  return await response.json();
};

export const updateProductPrice = async (data: UpdatePriceData, token: string) => {
  const response = await fetch(`${API_URL}/admin/products/price`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update price');
  }

  return await response.json();
};

export const addNewProduct = async (data: AddProductData, token: string) => {
  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to add product');
  }

  return await response.json();
};

export const updateProduct = async (productId: string, data: Partial<AddProductData>, token: string) => {
  const response = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update product');
  }

  return await response.json();
};

export const deleteProduct = async (productId: string, token: string) => {
  const response = await fetch(`${API_URL}/admin/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }

  return await response.json();
};