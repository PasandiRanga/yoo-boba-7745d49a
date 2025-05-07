import { pool } from './db/index';
import { Product } from '../models/ProductModel';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        image_urls as "imageUrls", 
        category, 
        weight, 
        stock, 
        featured, 
        details
      FROM products
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        id, 
        name, 
        description, 
        price, 
        image_urls as "imageUrls", 
        category, 
        weight, 
        stock, 
        featured, 
        details
      FROM products
      WHERE id = $1
      `,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        image_urls as "imageUrls", 
        category, 
        weight, 
        stock, 
        featured, 
        details
      FROM products
      WHERE featured = true
      LIMIT 6
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};