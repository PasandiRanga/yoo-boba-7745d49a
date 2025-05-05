
import { products, Product, getProductById as getLocalProductById } from '@/models/ProductModel';
import { 
  getAllProductsFromDb, 
  getFeaturedProductsFromDb,
  getProductsByCategoryFromDb,
  getProductByIdFromDb 
} from '@/models/db/ProductModel';

// Check if we should use database or local data
const useDatabase = () => {
  try {
    // Check for environment variables that would indicate DB connection
    return Boolean(process.env.DB_HOST);
  } catch (e) {
    return false;
  }
};

// API functions that decide whether to use DB or local data
export const getAllProducts = async (): Promise<Product[]> => {
  if (useDatabase()) {
    const dbProducts = await getAllProductsFromDb();
    return dbProducts.length > 0 ? dbProducts : products.filter(p => p.available !== false);
  }
  return products.filter(p => p.available !== false);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  if (useDatabase()) {
    const dbProducts = await getFeaturedProductsFromDb();
    return dbProducts.length > 0 ? dbProducts : products.filter(p => p.featured && p.available !== false);
  }
  return products.filter(p => p.featured && p.available !== false);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  if (useDatabase()) {
    const dbProducts = await getProductsByCategoryFromDb(category);
    return dbProducts.length > 0 ? dbProducts : products.filter(p => p.category === category && p.available !== false);
  }
  return products.filter(p => p.category === category && p.available !== false);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  if (useDatabase()) {
    const dbProduct = await getProductByIdFromDb(id);
    return dbProduct || getLocalProductById(id) || null;
  }
  const product = getLocalProductById(id);
  return product && product.available !== false ? product : null;
};
