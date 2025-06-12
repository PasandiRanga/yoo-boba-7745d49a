import { Request, Response } from 'express';
import { pool } from '../db/index';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Admin Registration
export const registerAdmin = async (req: Request, res: Response) => {
  const { name, email, address, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT * FROM admin WHERE email = $1',
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new admin
    const result = await pool.query(
      `INSERT INTO admin (name, email, address, password) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, address`,
      [name, email, address, hashedPassword]
    );

    const admin = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin,
      token
    });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Login
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const result = await pool.query(
      'SELECT * FROM admin WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...adminData } = admin;

    res.json({
      success: true,
      message: 'Login successful',
      admin: adminData,
      token
    });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Orders for Admin Dashboard
export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const ordersResult = await pool.query(`
      SELECT 
        o.*,
        CASE 
          WHEN o.is_guest_order = true THEN 
            json_build_object(
              'firstName', gc.first_name,
              'lastName', gc.last_name,
              'email', gc.email,
              'phone', gc.phone,
              'company', gc.company
            )
          ELSE 
            json_build_object(
              'firstName', c.first_name,
              'lastName', c.last_name,
              'email', c.emailaddress,
              'phone', c.contactno,
              'company', null
            )
        END as customer
      FROM orders o
      LEFT JOIN guest_customers gc ON o.id = gc.order_id AND o.is_guest_order = true
      LEFT JOIN user_orders uo ON o.id = uo.order_id AND o.is_guest_order = false
      LEFT JOIN customers c ON uo.customerid = c.customerid AND o.is_guest_order = false
      ORDER BY o.created_at DESC
    `);

    // Get items and addresses for each order
    const enrichedOrders = await Promise.all(
      ordersResult.rows.map(async (order) => {
        // Get items
        const itemsResult = await pool.query(
          'SELECT * FROM order_items WHERE order_id = $1',
          [order.id]
        );

        // Get addresses
        const addressesResult = await pool.query(
          'SELECT * FROM order_addresses WHERE order_id = $1',
          [order.id]
        );

        const shippingAddress = addressesResult.rows.find(addr => addr.address_type === 'shipping');
        const billingAddress = addressesResult.rows.find(addr => addr.address_type === 'billing');

        return {
          ...order,
          items: itemsResult.rows,
          shippingAddress,
          billingAddress
        };
      })
    );

    res.json(enrichedOrders);
  } catch (error) {
    console.error('Error fetching orders for admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Order Status
export const updateOrderStatusAdmin = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get All Products with Details
export const getAllProductsWithDetails = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'weight', pd.weight,
            'price', pd.price,
            'stock', pd.stock
          )
        ) as variants
      FROM products p
      LEFT JOIN product_details pd ON p.product_id = pd.product_id
      GROUP BY p.product_id, p.name, p.description, p.images, p.attributes, p.featured
      ORDER BY p.product_id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Product Stock
export const updateProductStock = async (req: Request, res: Response) => {
  const { productId, weight, stock } = req.body;

  try {
    const result = await pool.query(
      'UPDATE product_details SET stock = $1 WHERE product_id = $2 AND weight = $3 RETURNING *',
      [stock, productId, weight]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      productDetail: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Product Price
export const updateProductPrice = async (req: Request, res: Response) => {
  const { productId, weight, price } = req.body;

  try {
    const result = await pool.query(
      'UPDATE product_details SET price = $1 WHERE product_id = $2 AND weight = $3 RETURNING *',
      [price, productId, weight]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product variant not found' });
    }

    res.json({
      success: true,
      message: 'Price updated successfully',
      productDetail: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add New Product
export const addNewProduct = async (req: Request, res: Response) => {
  const { productId, name, description, images, attributes, featured, variants } = req.body;

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert product
      await client.query(
        `INSERT INTO products (product_id, name, description, images, attributes, featured)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [productId, name, description, images, JSON.stringify(attributes), featured]
      );

      // Insert product variants
      for (const variant of variants) {
        await client.query(
          `INSERT INTO product_details (product_id, weight, price, stock)
           VALUES ($1, $2, $3, $4)`,
          [productId, variant.weight, variant.price, variant.stock]
        );
      }

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Product added successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Product Details
export const updateProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { name, description, images, attributes, featured } = req.body;

  try {
    const result = await pool.query(
      `UPDATE products SET 
        name = $1, 
        description = $2, 
        images = $3, 
        attributes = $4, 
        featured = $5
       WHERE product_id = $6 RETURNING *`,
      [name, description, images, JSON.stringify(attributes), featured, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Product
export const deleteProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete product details first
      await client.query('DELETE FROM product_details WHERE product_id = $1', [productId]);
      
      // Delete product
      const result = await client.query('DELETE FROM products WHERE product_id = $1', [productId]);

      if (result.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Product not found' });
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Customer management
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT customerid, fullname, emailaddress, contactno, address FROM customer');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};