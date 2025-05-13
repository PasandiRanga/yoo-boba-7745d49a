import { Request, Response } from 'express';
import { pool } from '../db/index';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT product_id, name, description, images as "imageUrls",
            attributes as "details"
      FROM products
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // First, get the product base information
    const productQuery = `
      SELECT 
        p.product_id, 
        p.name, 
        p.description, 
        p.images as "imageUrls", 
        p.attributes as "details"
      FROM products p
      WHERE p.product_id = $1
    `;
    
    const productResult = await pool.query(productQuery, [id]);
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get product variants (weights, prices, stock)
    const variantsQuery = `
      SELECT 
        pd.weight, 
        pd.price, 
        pd.stock
      FROM product_details pd
      WHERE pd.product_id = $1
      ORDER BY 
        CASE 
          WHEN pd.weight = '250g' THEN 1
          WHEN pd.weight = '500g' THEN 2
          WHEN pd.weight = '1kg' THEN 3
          ELSE 4
        END
    `;
    
    const variantsResult = await pool.query(variantsQuery, [id]);
    
    // Combine the results
    const product = {
      ...productResult.rows[0],
      variants: variantsResult.rows,
      price: variantsResult.rows[0]?.price || 0, // Default price (first variant)
      weight: variantsResult.rows[0]?.weight || '', // Default weight (first variant)
      stockQuantity: variantsResult.rows[0]?.stockQuantity || 0, // Default stock (first variant)
      category: productResult.rows[0]?.details?.category || 'Boba Pearls',
    };
    
    res.json(product);
    
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT product_id, name, description, images as "imageUrls", attributes as "details"
      FROM products
      WHERE featured = True
      LIMIT 6
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
