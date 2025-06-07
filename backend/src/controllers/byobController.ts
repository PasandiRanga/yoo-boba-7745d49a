// controllers/byobController.ts
import { Request, Response } from 'express';
import { pool } from '../db';

export const submitBYOBRequest = async (req: Request, res: Response) => {
  const {
    name,
    organizationName,
    category,
    contactNumber,
    email,
    address,
    productType,
    weight,
    maximumQuantity,
    productName,
  } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO byob_submissions (
        customer_name, organization_name, category, contact_number,
        email, business_address, product_id, product_name,
        weight, requested_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        name,
        organizationName,
        category,
        contactNumber,
        email,
        address,
        productType,
        productName,
        weight,
        maximumQuantity,
     
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error submitting BYOB request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
