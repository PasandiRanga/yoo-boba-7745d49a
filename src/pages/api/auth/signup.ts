import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fullName, contactNo, emailAddress, address, password } = req.body;

    // Validate required fields
    if (!fullName || !emailAddress || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique CustomerID (you can modify this format as needed)
    const customerId = `CUST${Date.now()}`;

    // Insert the new customer into the database
    const query = `
      INSERT INTO Customers (CustomerID, FullName, ContactNo, EmailAddress, Address, Password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING CustomerID
    `;

    const values = [customerId, fullName, contactNo, emailAddress, address, hashedPassword];

    const result = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      customerId: result.rows[0].CustomerID
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating your account'
    });
  }
} 