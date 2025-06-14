import { Request, Response } from 'express';
import { pool } from '../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService';


const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};


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
      getJwtSecret(),
      { expiresIn: '2h' } // token expiration time
    );

    res.json({
      message: 'Login successful',
      token,
      customer: {
        customerid: user.customerid,
        first_name: user.first_name,
        last_name: user.last_name,
        emailaddress: user.emailaddress
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
      SELECT customerid, first_name, last_name, email, phone, address
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
      SELECT customerid, first_name, last_name, emailaddress, contactno, address
      FROM customers
      WHERE customerid = $1
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
    
    // Send welcome email (optional)
    try {
      await sendWelcomeEmail(email, `${first_name} ${last_name}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the registration if email fails
    }
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating customer:', error);

    interface PgError extends Error {
      code?: string;
    }
    const pgError = error as PgError;
    if (pgError.code === '23505') {
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
    emailaddress, // Changed from 'email' to match frontend
    contactno,    // Changed from 'phone' to match frontend
    address,
    notes
  } = req.body;

  try {
    const { rows } = await pool.query(`
      UPDATE customers
      SET first_name = $1,
          last_name = $2,
          emailaddress = $3,
          contactno = $4,
          address = $5
      WHERE customerid = $6
      RETURNING customerid, first_name, last_name, emailaddress, contactno, address
    `, [first_name, last_name, emailaddress, contactno, address, id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(`Error updating customer with id ${id}:`, error);

    interface PgError extends Error {
      code?: string;
    }
    if (error instanceof Error && (error as PgError).code === '23505') { // Unique violation (e.g., duplicate email)
      return res.status(409).json({ message: 'Another customer with this email already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

// First, add a column to your customers table:
// ALTER TABLE customers ADD COLUMN deleted_at TIMESTAMP DEFAULT NULL;
// ALTER TABLE customers ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { rowCount } = await pool.query(`
      UPDATE customers 
      SET is_active = FALSE, deleted_at = NOW() 
      WHERE customerid = $1 AND is_active = TRUE
    `, [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Customer not found or already deleted' });
    }
    
    res.status(204).send();
    
  } catch (error) {
    console.error(`Error deleting customer with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update your get customers queries to exclude deleted customers:
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM customers 
      WHERE is_active = TRUE 
      ORDER BY customerid
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCustomerOrders = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // First check if customer exists
    const customerCheck = await pool.query(
      'SELECT id FROM customers WHERE customerid = $1',
      [id]
    );
    
    if (customerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const { rows } = await pool.query(`
      SELECT o.id, o.customerid, o.order_date, o.status, o.total_amount,
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

// Forgot Password - Request reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if customer exists
    const { rows } = await pool.query(
      'SELECT customerid, first_name FROM customers WHERE emailaddress = $1',
      [email]
    );

    // Always return success to prevent email enumeration attacks
    if (rows.length === 0) {
      return res.json({ 
        message: 'If an account with this email exists, you will receive a password reset link shortly.'
      });
    }

    const customer = rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in separate table
    await pool.query(
      'INSERT INTO password_reset_tokens (customerid, token, expires_at) VALUES ($1, $2, $3)',
      [customer.customerid, resetToken, expiresAt]
    );

    // Send password reset email
    try {
      await sendPasswordResetEmail(email, resetToken, customer.first_name);
      console.log(`Password reset email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Still return success to prevent email enumeration attacks
    }

    res.json({ 
      message: 'If an account with this email exists, you will receive a password reset link shortly.'
    });

  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password - Validate token and update password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // Find valid reset token
    const { rows } = await pool.query(
      'SELECT customerid FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used_at IS NULL',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const resetRecord = rows[0];

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    const updateResult = await pool.query(
      'UPDATE customers SET password = $1 WHERE customerid = $2',
      [hashedPassword, resetRecord.customerid.trim()]
    );

    if (updateResult.rowCount === 0) {
      console.error(`Failed to update password for customer ${resetRecord.customerid}`);
      return res.status(400).json({ message: 'Failed to reset password' });
    }

    // Mark token as used
    await pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE token = $1',
      [token]
    );

    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};