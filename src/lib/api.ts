// import { Product } from '../models/ProductModel';

// const API_BASE_URL = 'http://localhost:4000/api';

// export const fetchProducts = async (): Promise<Product[]> => {
//   const response = await fetch(`${API_BASE_URL}/products`);
//   if (!response.ok) throw new Error('Failed to fetch products');
//   return response.json();
// };

// export const fetchProductById = async (id: string): Promise<Product | null> => {
//   const response = await fetch(`${API_BASE_URL}/products/${id}`);
//   if (!response.ok) throw new Error('Failed to fetch product');
//   return response.json();
// };

// export const fetchFeaturedProducts = async (): Promise<Product[]> => {
//   const response = await fetch(`${API_BASE_URL}/products/featured`);
//   if (!response.ok) throw new Error('Failed to fetch featured products');
//   return response.json();
// };
