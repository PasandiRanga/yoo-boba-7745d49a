import { Request, Response } from 'express';
import { pool } from '../db/index';

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, description, price, images as "imageUrls",
             category, weight, stock, featured, attributes as "details"
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
    const { rows } = await pool.query(`
      SELECT id, name, description, price, images as "imageUrls",
             category, weight, stock, featured, attributes as "details"
      FROM products
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, name, description, price, images as "imageUrls",
             category, weight, stock, featured, attributes as "details"
      FROM products
      WHERE featured = true
      LIMIT 6
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
