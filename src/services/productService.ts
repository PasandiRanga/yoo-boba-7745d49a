// src/services/productService.ts
import { Product } from '@/models/ProductModel';

// Base API URL - adjust this to your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// Fetch featured products
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/featured`);
    if (!response.ok) {
      throw new Error(`Failed to fetch featured products: ${response.status}`);
    }
    return await response.json();
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