import { query } from '@/lib/db/db';
import { Product } from '../ProductModel';

// Get all products from database
export const getAllProductsFromDb = async (): Promise<Product[]> => {
  try {
    const result = await query<Product>(
      `SELECT 
        id,
        name,
        description,
        price,
        images,
        category,
        weight,
        stock,
        featured,
        attributes
      FROM products`
    );
    return result;
  } catch (error) {
    console.error('Error fetching all products from DB:', error);
    return [];
  }
};

// Get featured products from database
export const getFeaturedProductsFromDb = async (): Promise<Product[]> => {
  try {
    const result = await query<Product>(
      `SELECT 
        id,
        name,
        description,
        price,
        images,
        category,
        weight,
        stock,
        featured,
        attributes
      FROM products
      WHERE featured = true`
    );
    return result;
  } catch (error) {
    console.error('Error fetching featured products from DB:', error);
    return [];
  }
};

// Get products by category from database
export const getProductsByCategoryFromDb = async (category: string): Promise<Product[]> => {
  try {
    const result = await query<Product>(
      `SELECT 
        id,
        name,
        description,
        price,
        images,
        category,
        weight,
        stock,
        featured,
        attributes
      FROM products
      WHERE category = $1`,
      [category]
    );
    return result;
  } catch (error) {
    console.error(`Error fetching ${category} products from DB:`, error);
    return [];
  }
};

// Get single product by ID from database
export const getProductByIdFromDb = async (id: string): Promise<Product | null> => {
  try {
    const result = await query<Product>(
      `SELECT 
        id,
        name,
        description,
        price,
        images,
        category,
        weight,
        stock,
        featured,
        attributes
      FROM products
      WHERE id = $1`,
      [id]
    );
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching product ${id} from DB:`, error);
    return null;
  }
};