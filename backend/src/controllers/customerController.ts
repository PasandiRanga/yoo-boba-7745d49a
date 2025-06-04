import { Request, Response } from 'express';
import { pool } from '../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with environment variable in production


export const loginCustomer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const { rows } = await pool.query(`
      SELECT customerid, first_name, last_name, emailaddress, password 
      FROM customers 
      WHERE emailaddress = $1
    `, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        customerid: user.customerid,
        email: user.emailaddress,
        name: `${user.first_name} ${user.last_name}`
      },
      JWT_SECRET,
      { expiresIn: '2h' } // token expiration time
    );

    res.json({
      message: 'Login successful',
      token,
      customer: {
        id: user.customerid,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.emailaddress
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllCustomers = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT id, first_name, last_name, email, phone, address, 
             created_at, updated_at, status, notes
      FROM customers
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT id, first_name, last_name, email, phone, address, 
             created_at, updated_at, status, notes
      FROM customers
      WHERE id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching customer with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    address
  } = req.body;
  
  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      'SELECT customerid FROM customers WHERE emailaddress = $1',
      [email]
    );
    
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Customer with this email already exists' });
    }
    
    // Check if phone already exists
    const phoneCheck = await pool.query(
      'SELECT customerid FROM customers WHERE contactno = $1',
      [phone]
    );
    
    if (phoneCheck.rows.length > 0) {
      return res.status(409).json({ message: 'Customer with this phone number already exists' });
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert customer with hashed password - customerid is auto-incrementing
    const { rows } = await pool.query(`
      INSERT INTO customers (
        first_name,
        last_name,
        emailaddress,
        contactno,
        password,
        address
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING customerid, first_name, last_name, emailaddress, contactno, address
    `, [first_name, last_name, email, phone, hashedPassword, address]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    
    type PgError = Error & { code?: string };
    if (error instanceof Error && (error as PgError).code === '23505') {
      return res.status(409).json({ message: 'Duplicate entry found' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { 
    first_name,
    last_name,
    email,
    phone,
    address,
    status,
    notes
  } = req.body;

  try {
    const { rows } = await pool.query(`
      UPDATE customers
      SET first_name = $1,
          last_name = $2,
          email = $3,
          phone = $4,
          address = $5,
          status = $6,
          notes = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, first_name, last_name, email, phone, address, 
                created_at, updated_at, status, notes
    `, [first_name, last_name, email, phone, address, status, notes, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);
    
    type PgError = Error & { code?: string };
    if (error instanceof Error && (error as PgError).code === '23505') { // Unique violation (e.g., duplicate email)
      return res.status(409).json({ message: 'Another customer with this email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(`
      DELETE FROM customers
      WHERE id = $1
    `, [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // First check if customer exists
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE id = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const { rows } = await pool.query(`
      SELECT o.id, o.customer_id, o.order_date, o.status, o.total_amount,
             o.shipping_address, o.payment_method, o.shipping_method
      FROM orders o
      WHERE o.customer_id = $1
      ORDER BY o.order_date DESC
    `, [id]);
    
    res.json(rows);
  } catch (error) {
    console.error(`Error fetching orders for customer ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};