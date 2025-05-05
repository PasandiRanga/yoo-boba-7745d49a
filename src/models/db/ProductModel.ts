
import { query } from '@/lib/db';
import { Product } from '@/models/ProductModel';

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  weight: string;
  images: string[];
  attributes: Record<string, any>;
  featured: boolean;
  available: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all products from the database
export const getAllProductsFromDb = async (): Promise<Product[]> => {
  try {
    const products = await query<DbProduct>(`
      SELECT * FROM products 
      WHERE available = TRUE 
      ORDER BY created_at DESC
    `);
    
    return products.map(mapDbProductToProduct);
  } catch (error) {
    console.error('Error fetching products from database:', error);
    // Fallback to local data if database is not available
    return [];
  }
};

// Get featured products from the database
export const getFeaturedProductsFromDb = async (): Promise<Product[]> => {
  try {
    const products = await query<DbProduct>(`
      SELECT * FROM products 
      WHERE featured = TRUE AND available = TRUE 
      ORDER BY created_at DESC 
      LIMIT 3
    `);
    
    return products.map(mapDbProductToProduct);
  } catch (error) {
    console.error('Error fetching featured products from database:', error);
    // Fallback to local data if database is not available
    return [];
  }
};

// Get products by category from the database
export const getProductsByCategoryFromDb = async (category: string): Promise<Product[]> => {
  try {
    const products = await query<DbProduct>(
      `SELECT * FROM products 
       WHERE category = $1 AND available = TRUE 
       ORDER BY created_at DESC`,
      [category]
    );
    
    return products.map(mapDbProductToProduct);
  } catch (error) {
    console.error('Error fetching products by category from database:', error);
    // Fallback to local data if database is not available
    return [];
  }
};

// Get product by ID from the database
export const getProductByIdFromDb = async (id: string): Promise<Product | null> => {
  try {
    const products = await query<DbProduct>(
      `SELECT * FROM products 
       WHERE id = $1 AND available = TRUE 
       LIMIT 1`,
      [id]
    );
    
    if (products.length === 0) {
      return null;
    }
    
    return mapDbProductToProduct(products[0]);
  } catch (error) {
    console.error('Error fetching product by ID from database:', error);
    // Fallback to local data if database is not available
    return null;
  }
};

// Map database product to Product model
const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
  // Extract specs from attributes if they exist
  const { specs, ...otherAttributes } = dbProduct.attributes;

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: dbProduct.price,
    stock: dbProduct.stock,
    category: dbProduct.category,
    weight: dbProduct.weight,
    images: dbProduct.images,
    attributes: {
      ...otherAttributes,
      specs: specs || {}
    },
    featured: dbProduct.featured,
    available: dbProduct.available
  };
};
