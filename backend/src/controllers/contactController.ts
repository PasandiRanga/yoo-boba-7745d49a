// controllers/contactController.ts
import { Request, Response } from 'express';
import { pool } from '../db';

export const submitContactRequest = async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO contact_submissions (
        name, email, phone, subject, message
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, email, phone, subject, message]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error submitting contact request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
