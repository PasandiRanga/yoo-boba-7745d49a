import { Request, Response } from 'express';
import { pool } from '../db/index';
import * as ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

// Create Excel directory if it doesn't exist
const excelDir = path.join(__dirname, '../excel');
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

export const createOrder = async (req: Request, res: Response) => {
  const { 
    orderId, 
    customer, 
    shippingAddress, 
    billingAddress, 
    items, 
    amount, 
    paymentMethod, 
    status 
  } = req.body;

  console.error('Creating order with data:', req.body);
  console.error('Order ID:', orderId);
  console.error('User id ' , customer.userId);

  try {
    const isGuestOrder = !customer.userId;
    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // Insert into orders table
      const orderResult = await client.query(
        `INSERT INTO orders (
          id, 
          total_amount, 
          status, 
          payment_method, 
          payment_status, 
          created_at, 
          updated_at, 
          is_guest_order
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING *`,
        [orderId, amount, status, paymentMethod, 'pending', isGuestOrder]
      );

      const order = orderResult.rows[0];

      // Insert customer information
      if (isGuestOrder) {
        // For guest users
        await client.query(
          `INSERT INTO guest_customers (
            order_id, 
            first_name, 
            last_name, 
            email, 
            phone, 
            company
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId, 
            customer.firstName, 
            customer.lastName, 
            customer.email, 
            customer.phone, 
            customer.company || null
          ]
        );
      } else {
        // For logged-in users, associate with user account
        await client.query(
          `INSERT INTO user_orders (
            order_id, 
            customerid
          ) VALUES ($1, $2)`,
          [orderId, customer.userId]
        );
      }

      // Insert shipping address
      await client.query(
        `INSERT INTO order_addresses (
          order_id, 
          address_type, 
          street1, 
          street2, 
          city, 
          state, 
          zip_code, 
          country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          orderId, 
          'shipping', 
          shippingAddress.street1, 
          shippingAddress.street2 || null, 
          shippingAddress.city, 
          shippingAddress.state, 
          shippingAddress.zipCode, 
          shippingAddress.country
        ]
      );

      // Insert billing address
      await client.query(
        `INSERT INTO order_addresses (
          order_id, 
          address_type, 
          street1, 
          street2, 
          city, 
          state, 
          zip_code, 
          country
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          orderId, 
          'billing', 
          billingAddress.street1, 
          billingAddress.street2 || null, 
          billingAddress.city, 
          billingAddress.state, 
          billingAddress.zipCode, 
          billingAddress.country
        ]
      );

      // Insert order items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (
            order_id, 
            product_id, 
            name, 
            price, 
            quantity
          ) VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.productId, item.name, item.price, item.quantity]
        );
      }

      // Save to Excel spreadsheet based on user type
      try {
        await saveOrderToExcel(order, customer, shippingAddress, billingAddress, items, isGuestOrder);
        console.log(`Order ${orderId} successfully saved to Excel`);
      } catch (excelError) {
        console.error(`Failed to save order ${orderId} to Excel:`, excelError);
        // Don't fail the order creation, just log the error
      }

      // Commit transaction
      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: orderResult.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM orders
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Get order details
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderResult.rows[0];
    const isGuestOrder = order.is_guest_order;

    // Get customer info
    let customer;
    if (isGuestOrder) {
      const customerResult = await pool.query(
        `SELECT * FROM guest_customers WHERE order_id = $1`,
        [id]
      );
      customer = customerResult.rows[0];
    } else {
      const userOrderResult = await pool.query(
        `SELECT uo.*, u.first_name, u.last_name, u.emailaddress, u.contactno 
         FROM user_orders uo
         JOIN customers u ON uo.customerid = u.customerid
         WHERE uo.order_id = $1`,
        [id]
      );
      customer = userOrderResult.rows[0];
    }

    // Get addresses
    const addressesResult = await pool.query(
      `SELECT * FROM order_addresses WHERE order_id = $1`,
      [id]
    );
    
    const shippingAddress = addressesResult.rows.find(addr => addr.address_type === 'shipping');
    const billingAddress = addressesResult.rows.find(addr => addr.address_type === 'billing');

    // Get items
    const itemsResult = await pool.query(
      `SELECT * FROM order_items WHERE order_id = $1`,
      [id]
    );

    res.json({
      order: {
        ...order,
        customer,
        shippingAddress,
        billingAddress,
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const client = await pool.connect();
    
    try {
      // Start transaction
      await client.query('BEGIN');
      
      // Delete related records first due to foreign key constraints
      await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
      await client.query('DELETE FROM order_addresses WHERE order_id = $1', [id]);
      await client.query('DELETE FROM guest_customers WHERE order_id = $1', [id]);
      await client.query('DELETE FROM user_orders WHERE order_id = $1', [id]);
      
      // Finally delete the order itself
      const { rowCount } = await client.query('DELETE FROM orders WHERE id = $1', [id]);
      
      if (rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Commit transaction
      await client.query('COMMIT');
      
      res.status(204).send();
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Error deleting order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const client = await pool.connect();

    try {
      // Start transaction
      await client.query('BEGIN');

      // Update order status to cancelled
      const result = await client.query(
        `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Order not found' });
      }

      const updatedOrder = result.rows[0];

      // Update Excel file with cancelled status
      await updateOrderInExcel(id, 'cancelled');

      // Commit transaction
      await client.query('COMMIT');

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        order: updatedOrder
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(`Error cancelling order with id ${id}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    // Step 1: Check if the customer exists
    const customerCheck = await pool.query(
      'SELECT customerid FROM customers WHERE customerid = $1',
      [customerId]
    );

    console.error(`Checking customer with ID ${customerId}:`, customerCheck.rows);

    if (customerCheck.rows.length === 0) {
      console.error(`Customer with ID ${customerId} not found`);  
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Step 2: Get all orders for this customer
    const ordersResult = await pool.query(`
      SELECT o.* 
      FROM orders o
      JOIN user_orders uo ON o.id = uo.order_id
      WHERE uo.customerid = $1
      ORDER BY o.created_at DESC
    `, [customerId]);

    console.error(`Orders for customer ${customerId}:`, ordersResult.rows);

    const orders = ordersResult.rows;

    console.error(`Found ${orders.length} orders for customer ${customerId}`);

    // Step 3: For each order, get items and addresses
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        // Get items for this order
        const itemsResult = await pool.query(
          `SELECT * FROM order_items WHERE order_id = $1`,
          [order.id]
        );

        console.error(`Items for order ${order.id}:`, itemsResult.rows);

        // Get addresses (both shipping and billing)
        const addressesResult = await pool.query(
          `SELECT * FROM order_addresses WHERE order_id = $1`,
          [order.id]
        );

        console.error(`Addresses for order ${order.id}:`, addressesResult.rows);

        return {
          ...order,
          items: itemsResult.rows,
          addresses: addressesResult.rows,
        };
      })
    );

    res.json(enrichedOrders);
  } catch (error) {
    console.error(`Error fetching orders for customer ${customerId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Helper function to save order to Excel
interface Order {
  id: string;
  created_at: string | Date;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Item {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

async function saveOrderToExcel(
  order: Order,
  customer: Customer,
  shippingAddress: Address,
  billingAddress: Address,
  items: Item[],
  isGuestOrder: boolean
) {
  console.log(`Starting Excel save for order ${order.id}, isGuestOrder: ${isGuestOrder}`);
  
  try {
    // Ensure the excel directory exists
    if (!fs.existsSync(excelDir)) {
      console.log(`Creating Excel directory: ${excelDir}`);
      fs.mkdirSync(excelDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const fileName = isGuestOrder ? 'guest_orders.xlsx' : 'user_orders.xlsx';
    const filePath = path.join(excelDir, fileName);
    
    console.log(`Excel file path: ${filePath}`);
    
    let worksheet;
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      console.log(`Reading existing Excel file: ${fileName}`);
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet('Orders');
      
      // If worksheet doesn't exist in the file, create it
      if (!worksheet) {
        console.log('Orders worksheet not found, creating new one');
        worksheet = workbook.addWorksheet('Orders');
        
        // Add headers
        worksheet.columns = [
          { header: 'Order ID', key: 'orderId', width: 36 },
          { header: 'Date', key: 'date', width: 20 },
          { header: 'Customer Name', key: 'customerName', width: 30 },
          { header: 'Email', key: 'email', width: 30 },
          { header: 'Phone', key: 'phone', width: 15 },
          { header: 'Address', key: 'address', width: 40 },
          { header: 'City', key: 'city', width: 15 },
          { header: 'Items', key: 'items', width: 50 },
          { header: 'Total', key: 'total', width: 10 },
          { header: 'Payment Method', key: 'paymentMethod', width: 15 },
          { header: 'Payment Status', key: 'paymentStatus', width: 15 },
          { header: 'Order Status', key: 'orderStatus', width: 15 }
        ];
      }
    } else {
      console.log(`Creating new Excel file: ${fileName}`);
      worksheet = workbook.addWorksheet('Orders');
      
      // Add headers
      worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 36 },
        { header: 'Date', key: 'date', width: 20 },
        { header: 'Customer Name', key: 'customerName', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Address', key: 'address', width: 40 },
        { header: 'City', key: 'city', width: 15 },
        { header: 'Items', key: 'items', width: 50 },
        { header: 'Total', key: 'total', width: 10 },
        { header: 'Payment Method', key: 'paymentMethod', width: 15 },
        { header: 'Payment Status', key: 'paymentStatus', width: 15 },
        { header: 'Order Status', key: 'orderStatus', width: 15 }
      ];
    }
    
    // Prepare the order data
    const orderData = {
      orderId: order.id,
      date: new Date(order.created_at).toLocaleString(),
      customerName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: `${shippingAddress.street1} ${shippingAddress.street2 || ''}`.trim(),
      city: shippingAddress.city,
      items: items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      total: order.total_amount,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      orderStatus: order.status
    };

    console.log('Adding order data to Excel:', orderData);
    
    // Add row if worksheet is defined
    if (worksheet) {
      const newRow = worksheet.addRow(orderData);
      console.log(`Added row ${newRow.number} to Excel worksheet`);
    } else {
      throw new Error('Worksheet could not be created or found');
    }
    
    // Save the file
    console.log(`Saving Excel file: ${filePath}`);
    await workbook.xlsx.writeFile(filePath);
    console.log(`Excel file saved successfully: ${fileName}`);
    
  } catch (error) {
    console.error('Error saving to Excel:', error);
    throw error; // Re-throw so the calling function can handle it
  }
}

// Helper function to update order status in Excel files
async function updateOrderInExcel(orderId: string, newStatus: string) {
  try {
    const filePaths = [
      path.join(excelDir, 'guest_orders.xlsx'),
      path.join(excelDir, 'user_orders.xlsx')
    ];

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet('Orders');
        
        if (worksheet) {
          // Find the row with the matching order ID and update status
          worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
              const orderIdCell = row.getCell(1); // Order ID is in first column
              if (orderIdCell.value === orderId) {
                row.getCell(12).value = newStatus.toUpperCase(); // Order Status is in 12th column
              }
            }
          });
          
          // Save the updated file
          await workbook.xlsx.writeFile(filePath);
        }
      }
    }
  } catch (error) {
    console.error('Error updating Excel file:', error);
    // Don't throw error to prevent breaking the main flow
  }
}