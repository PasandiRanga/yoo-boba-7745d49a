import { Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../db/index';
import dotenv from 'dotenv';

dotenv.config();

// PayHere configuration
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '';
if (!PAYHERE_MERCHANT_SECRET) {
  throw new Error('PAYHERE_MERCHANT_SECRET is not defined in the environment variables');
}
const PAYHERE_RETURN_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-domain.com/payment-success'
  : 'http://localhost:3000/payment-success';
const PAYHERE_CANCEL_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/payment-canceled'
  : 'http://localhost:3000/payment-canceled';
const PAYHERE_NOTIFY_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-domain.com/api/payments/notify'
  : 'https://your-ngrok-url.ngrok.io/api/payments/notify'; // You'll need ngrok for local testing

// Initialize payment with PayHere
export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { 
      orderId, 
      items, 
      customer, 
      amount,
      shippingAddress,
      billingAddress
    }: { 
      orderId: string; 
      items: { name: string }[]; 
      customer: { firstName: string; lastName: string; email: string; phone: string }; 
      amount: number; 
      shippingAddress: { street1: string; city: string; country: string }; 
      billingAddress?: { street1: string; city: string; country: string } 
    } = req.body;
    
    // Validate required fields
    if (!orderId || !items || !customer || !amount || !shippingAddress) {
      console.log("Missing information");
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required payment information' 
      });
    }
    
    // Store pending order information temporarily
    await pool.query(
      `INSERT INTO payment_sessions (
        session_id, 
        order_data, 
        created_at
      ) VALUES ($1, $2, NOW())
      ON CONFLICT (session_id) DO UPDATE 
      SET order_data = $2, created_at = NOW()`,
      [
        orderId,
        JSON.stringify({
          orderId,
          items,
          customer,
          amount,
          shippingAddress,
          billingAddress,
          paymentMethod: 'payhere'
        })
      ]
    );
    
    // Format amount to 2 decimal places
    const formattedAmount = amount.toFixed(2);
    const currency = 'LKR';
    
    // FIXED: Generate the hash correctly according to PayHere specifications
    // Format: md5(merchantId + orderId + amount + currency + md5(merchantSecret))
    const merchantSecretHash = crypto
      .createHash('md5')
      .update(PAYHERE_MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();
      
    const hash = crypto
      .createHash('md5')
      .update(`${PAYHERE_MERCHANT_ID}${orderId}${formattedAmount}${currency}${merchantSecretHash}`)
      .digest('hex')
      .toUpperCase();
    
    // Prepare PayHere request data
    const paymentData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      return_url: PAYHERE_RETURN_URL,
      cancel_url: PAYHERE_CANCEL_URL,
      notify_url: PAYHERE_NOTIFY_URL,
      order_id: orderId,
      items: items.map(item => item.name).join(', '),
      amount: formattedAmount,
      currency: currency,
      hash: hash,
      first_name: customer.firstName,
      last_name: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: shippingAddress.street1,
      city: shippingAddress.city,
      country: shippingAddress.country
    };
    
    res.json({ 
      success: true, 
      paymentData 
    });
    
  } catch (error) {
    console.error('Error initializing payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initialize payment' 
    });
  }
};

// Handle PayHere notifications (webhook)
export const handlePaymentNotification = async (req: Request, res: Response) => {
  try {
    const { 
      merchant_id, 
      order_id, 
      payment_id, 
      payhere_amount, 
      payhere_currency,
      status_code, 
      md5sig 
    } = req.body;
    
    // FIXED: Verify the notification with MD5 signature
    // The signature format should match exactly how PayHere creates it
    const merchantSecretHash = crypto
      .createHash('md5')
      .update(PAYHERE_MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();
      
    const expectedHash = crypto
      .createHash('md5')
      .update(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${merchantSecretHash}`)
      .digest('hex')
      .toUpperCase();
    
    if (md5sig !== expectedHash) {
      console.error('Invalid PayHere notification signature');
      return res.status(400).send('Invalid signature');
    }
    
    // Update order status based on PayHere status code
    let orderStatus = 'PENDING';
    
    if (status_code === '2') {
      orderStatus = 'PAID'; // Payment successful
    } else if (status_code === '0') {
      orderStatus = 'PENDING'; // Payment pending
    } else if (['-1', '-2'].includes(status_code)) {
      orderStatus = 'CANCELED'; // Payment canceled or failed
    } else if (status_code === '-3') {
      orderStatus = 'CHARGEDBACK'; // Payment charged back
    }
    
    // Get the stored order data
    const sessionResult = await pool.query(
      'SELECT order_data FROM payment_sessions WHERE session_id = $1',
      [order_id]
    );
    
    if (sessionResult.rows.length === 0) {
      console.error('No payment session found for order:', order_id);
      return res.status(404).send('Order not found');
    }
    
    const orderData = sessionResult.rows[0].order_data;
    
    // If payment was successful, create the actual order
    if (orderStatus === 'PAID') {
      // Begin transaction
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Create the order
        const orderQuery = `
          INSERT INTO orders (
            order_id, 
            customer_id,
            total_amount, 
            status, 
            shipping_address, 
            billing_address, 
            payment_method,
            payment_reference
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING order_id
        `;
        
        const orderValues = [
          order_id,
          orderData.customer.id || null,
          orderData.amount,
          orderStatus,
          JSON.stringify(orderData.shippingAddress),
          JSON.stringify(orderData.billingAddress),
          'payhere',
          payment_id
        ];
        
        await client.query(orderQuery, orderValues);
        
        // Create order items
        for (const item of orderData.items) {
          await client.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) 
             VALUES ($1, $2, $3, $4)`,
            [order_id, item.productId, item.quantity, item.price]
          );
        }
        
        // Commit transaction
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }
    } else if (['CANCELED', 'CHARGEDBACK'].includes(orderStatus)) {
      // If payment was canceled or charged back, we don't create the order
      // But we might want to log this event
      await pool.query(
        `INSERT INTO payment_logs (order_id, status, payment_id, amount, log_data)
         VALUES ($1, $2, $3, $4, $5)`,
        [order_id, orderStatus, payment_id, payhere_amount, JSON.stringify(req.body)]
      );
    }
    
    // Respond to PayHere
    res.status(200).send('Notification received');
    
  } catch (error) {
    console.error('Error handling payment notification:', error);
    res.status(500).send('Server error');
  }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // First check if there's a completed order
    const orderResult = await pool.query(
      'SELECT status, payment_reference FROM orders WHERE order_id = $1',
      [orderId]
    );
    
    // If order exists, return its status
    if (orderResult.rows.length > 0) {
      return res.json({
        success: true,
        status: orderResult.rows[0].status,
        paymentReference: orderResult.rows[0].payment_reference
      });
    }
    
    // If no order yet, check payment sessions
    const sessionResult = await pool.query(
      'SELECT created_at FROM payment_sessions WHERE session_id = $1',
      [orderId]
    );
    
    if (sessionResult.rows.length > 0) {
      return res.json({
        success: true,
        status: 'PENDING',
        message: 'Payment has been initiated but not completed'
      });
    }
    
    // If not found in either table
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
    
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment status' 
    });
  }
};