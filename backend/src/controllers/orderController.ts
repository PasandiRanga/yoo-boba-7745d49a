import { Request, Response } from 'express';
import { pool } from '../db/index';

// Get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM orders
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const { rows } = await pool.query(`
      SELECT 
        o.order_id,
        o.customer_id,
        o.total_amount,
        o.status,
        o.shipping_address,
        o.billing_address,
        o.payment_method,
        o.payment_reference,
        o.created_at,
        (
          SELECT json_agg(
            json_build_object(
              'id', oi.id,
              'order_id', oi.order_id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'product', json_build_object(
                'product_id', p.product_id,
                'name', p.name,
                'description', p.description,
                'images', p.images,
                'attributes', p.attributes,
                'featured', p.featured
              )
            )
          )
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = o.order_id
        ) AS items
      FROM 
        orders o
      WHERE 
        o.order_id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Handle case where order has no items (null items array)
    if (rows[0].items === null) {
      rows[0].items = [];
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// // Create a new order
// export const createOrder = async (req: Request, res: Response) => {
//   const { customer_id, status, total_amount, shipping_address, items } = req.body;
  
//   try {
//     // Start a transaction
//     await pool.query('BEGIN');
    
//     // Create the order
//     const orderQuery = `
//       INSERT INTO orders (customer_id, status, total_amount, shipping_address, created_at)
//       VALUES ($1, $2, $3, $4, NOW())
//       RETURNING *
//     `;
    
//     const orderValues = [customer_id, status || 'pending', total_amount, shipping_address];
//     const orderResult = await pool.query(orderQuery, orderValues);
//     const orderId = orderResult.rows[0].order_id;
    
//     // Insert order items
//     if (items && items.length > 0) {
//       const itemsQuery = `
//         INSERT INTO order_items (order_id, product_id, quantity, price, weight)
//         VALUES ($1, $2, $3, $4, $5)
//       `;
      
//       for (const item of items) {
//         await pool.query(itemsQuery, [
//           orderId,
//           item.product_id,
//           item.quantity,
//           item.price,
//           item.weight
//         ]);
//       }
//     }
    
//     // Commit the transaction
//     await pool.query('COMMIT');
    
//     // Return the created order with its items
//     const createdOrder = await getOrderWithItems(orderId);
    
//     res.status(201).json(createdOrder);
//   } catch (error) {
//     // Rollback the transaction in case of error
//     await pool.query('ROLLBACK');
    
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// Update an existing order
export const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, total_amount, shipping_address } = req.body;
  
  try {
    // Check if order exists
    const checkQuery = 'SELECT * FROM orders WHERE order_id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Build the update query dynamically based on provided fields
    let updateQuery = 'UPDATE orders SET ';
    const updateValues = [];
    const updateFields = [];
    
    let paramIndex = 1;
    
    if (status !== undefined) {
      updateFields.push(`status = $${paramIndex}`);
      updateValues.push(status);
      paramIndex++;
    }
    
    if (total_amount !== undefined) {
      updateFields.push(`total_amount = $${paramIndex}`);
      updateValues.push(total_amount);
      paramIndex++;
    }
    
    if (shipping_address !== undefined) {
      updateFields.push(`shipping_address = $${paramIndex}`);
      updateValues.push(shipping_address);
      paramIndex++;
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    // If no fields to update, return the existing order
    if (updateFields.length === 0) {
      const order = await getOrderWithItems(id);
      return res.json(order);
    }
    
    updateQuery += updateFields.join(', ');
    updateQuery += ` WHERE order_id = $${paramIndex} RETURNING *`;
    updateValues.push(id);
    
    const updateResult = await pool.query(updateQuery, updateValues);
    
    // Return the updated order with its items
    const updatedOrder = await getOrderWithItems(id);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    // Start a transaction
    await pool.query('BEGIN');
    
    // Delete associated order items first
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    
    // Delete the order
    const result = await pool.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);
    
    // Commit the transaction
    await pool.query('COMMIT');
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query('ROLLBACK');
    
    console.error(`Error deleting order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get orders by customer ID
export const getOrdersByCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  
  try {
    const orderQuery = `
      SELECT * FROM orders
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;
    
    const orderResult = await pool.query(orderQuery, [customerId]);
    
    // For each order, fetch its items
    const orders = await Promise.all(orderResult.rows.map(async (order) => {
      const items = await getOrderItems(order.order_id);
      return { ...order, items };
    }));
    
    res.json(orders);
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req: Request, res: Response) => {
  const { status } = req.params;
  
  try {
    const orderQuery = `
      SELECT * FROM orders
      WHERE status = $1
      ORDER BY created_at DESC
    `;
    
    const orderResult = await pool.query(orderQuery, [status]);
    
    // For each order, fetch its items
    const orders = await Promise.all(orderResult.rows.map(async (order) => {
      const items = await getOrderItems(order.order_id);
      return { ...order, items };
    }));
    
    res.json(orders);
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Process payment for an order
export const processOrderPayment = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { amount, method, ...paymentDetails } = req.body;
  
  try {
    // Check if order exists and is in pending status
    const orderQuery = 'SELECT * FROM orders WHERE order_id = $1';
    const orderResult = await pool.query(orderQuery, [orderId]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot process payment for order in ${order.status} status`
      });
    }
    
    // Insert payment record
    const paymentQuery = `
      INSERT INTO payments (order_id, amount, method, details, payment_date)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING payment_id
    `;
    
    const paymentResult = await pool.query(paymentQuery, [
      orderId, 
      amount, 
      method, 
      paymentDetails
    ]);
    
    const paymentId = paymentResult.rows[0].payment_id;
    
    // Update order status to 'paid'
    await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2',
      ['paid', orderId]
    );
    
    res.json({
      success: true,
      transactionId: paymentId,
      orderId: orderId,
      status: 'paid'
    });
  } catch (error) {
    console.error(`Error processing payment for order ${orderId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify payment status
export const verifyPaymentStatus = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  
  try {
    const paymentQuery = `
      SELECT * FROM payments
      WHERE payment_id = $1
    `;
    
    const paymentResult = await pool.query(paymentQuery, [paymentId]);
    
    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const payment = paymentResult.rows[0];
    
    res.json({
      status: 'completed',
      verified: true,
      paymentId: payment.payment_id,
      orderId: payment.order_id,
      amount: payment.amount,
      method: payment.method,
      paymentDate: payment.payment_date
    });
  } catch (error) {
    console.error(`Error verifying payment ${paymentId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to get order items
const getOrderItems = async (orderId: string | number) => {
  const query = `
    SELECT * FROM order_items
    WHERE order_id = $1
  `;
  
  const result = await pool.query(query, [orderId]);
  return result.rows;
};

// Helper function to get order with items
const getOrderWithItems = async (orderId: string | number) => {
  const orderQuery = `
    SELECT * FROM orders
    WHERE order_id = $1
  `;
  
  const orderResult = await pool.query(orderQuery, [orderId]);
  
  if (orderResult.rows.length === 0) {
    return null;
  }
  
  const order = orderResult.rows[0];
  const items = await getOrderItems(orderId);
  
  return { ...order, items };
};