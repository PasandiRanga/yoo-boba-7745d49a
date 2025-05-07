// import { query } from '@/lib/db/index';
// import { Product, ProductDetails } from '@/models/ProductModel';

// export interface DbProduct {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image_urls: string[]; // Changed from 'images' to match your DB column
//   category: string;
//   weight: string;
//   stock: number;
//   featured: boolean;
//   details: ProductDetails; // Changed from 'attributes' to match your DB
//   created_at?: Date;
//   updated_at?: Date;
// }

// // Get all products from the database
// export const getAllProductsFromDb = async (): Promise<Product[]> => {
//   try {
//     const products = await query<DbProduct>(`
//       SELECT 
//         id,
//         name,
//         description,
//         price,
//         image_urls as "imageUrls",
//         category,
//         weight,
//         stock,
//         featured,
//         details
//       FROM products 
//       ORDER BY created_at DESC
//     `);
    
//     return products.map(mapDbProductToProduct);
//   } catch (error) {
//     console.error('Error fetching products from database:', error);
//     throw error; // Better to throw and handle in the UI
//   }
// };

// // Get featured products from the database
// export const getFeaturedProductsFromDb = async (): Promise<Product[]> => {
//   try {
//     const products = await query<DbProduct>(`
//       SELECT 
//         id,
//         name,
//         description,
//         price,
//         image_urls as "imageUrls",
//         category,
//         weight,
//         stock,
//         featured,
//         details
//       FROM products 
//       WHERE featured = TRUE 
//       ORDER BY created_at DESC
//     `);
    
//     return products.map(mapDbProductToProduct);
//   } catch (error) {
//     console.error('Error fetching featured products from database:', error);
//     throw error;
//   }
// };

// // Get products by category from the database
// export const getProductsByCategoryFromDb = async (category: string): Promise<Product[]> => {
//   try {
//     const products = await query<DbProduct>(
//       `SELECT 
//         id,
//         name,
//         description,
//         price,
//         image_urls as "imageUrls",
//         category,
//         weight,
//         stock,
//         featured,
//         details
//       FROM products 
//       WHERE category = $1 
//       ORDER BY created_at DESC`,
//       [category]
//     );
    
//     return products.map(mapDbProductToProduct);
//   } catch (error) {
//     console.error('Error fetching products by category from database:', error);
//     throw error;
//   }
// };

// // Get product by ID from the database
// export const getProductByIdFromDb = async (id: string): Promise<Product | null> => {
//   try {
//     const products = await query<DbProduct>(
//       `SELECT 
//         id,
//         name,
//         description,
//         price,
//         image_urls as "imageUrls",
//         category,
//         weight,
//         stock,
//         featured,
//         details
//       FROM products 
//       WHERE id = $1 
//       LIMIT 1`,
//       [id]
//     );
    
//     if (products.length === 0) {
//       return null;
//     }
    
//     return mapDbProductToProduct(products[0]);
//   } catch (error) {
//     console.error('Error fetching product by ID from database:', error);
//     throw error;
//   }
// };

// // Map database product to Product model
// const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
//   return {
//     id: dbProduct.id,
//     name: dbProduct.name,
//     description: dbProduct.description,
//     price: dbProduct.price,
//     imageUrls: dbProduct.image_urls,
//     category: dbProduct.category,
//     weight: dbProduct.weight,
//     stock: dbProduct.stock,
//     featured: dbProduct.featured,
//     details: dbProduct.details
//   };
// };