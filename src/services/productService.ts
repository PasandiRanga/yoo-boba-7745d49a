
// src/services/productService.ts
import { Product } from '@/models/ProductModel';

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from:', `${API_URL}/products`);
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    const data = await response.json();
    console.log('Products fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    console.log('Fetching product with ID:', id);
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    const data = await response.json();
    console.log('Product fetched:', data);
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Fetch featured products
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching featured products from:', `${API_URL}/products/featured`);
    const response = await fetch(`${API_URL}/products/featured`);
    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.status}`);
    }
    const data = await response.json();
    console.log('Featured products fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Fetch products by category
export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products by category: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    throw error;
  }
};
