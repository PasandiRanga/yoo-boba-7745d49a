import { Request, Response } from 'express';
import crypto from 'crypto';
import { pool } from '../db';

export class PaymentController {
  /**
   * Verify payment status
   */
  static async verifyPayment(req: Request, res: Response) {
    console.error('Received payment verification request:', req.body);
    try {
      const { orderId, paymentId, status } = req.body;
      
      // Get secret key from environment
      const merchantId = process.env.PAYHERE_MERCHANT_ID || 1230460;
      const secretKey = process.env.PAYHERE_SECRET_KEY || "MTI2MjEwNjQ3MjI4Mjk1NDEyNzUzMjI5MDIxOTIwMjIwNjQwMjA1OA==";

      console.log('Merchant ID:', merchantId);
      console.log('Secret Key:', secretKey);
      
      if (!secretKey || !merchantId) {
        return res.status(500).json({ 
          success: false, 
          message: 'Payment gateway configuration error',
          paymentStatus: 'error'
        });
      }

      // Construct verification data
      const verificationData = {
        merchant_id: String(merchantId),
        order_id: String(orderId),
        payment_id: String(paymentId),
      };

      // Generate hash for verification request using the updated method
      const hash = PaymentController.generatePayHereHash(verificationData, secretKey);
      
      // Attempt to fetch payment status from PayHere
      const response = await fetch('https://sandbox.payhere.lk/api/payment/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYHERE_API_KEY}`
        },
        body: JSON.stringify({
          ...verificationData,
          hash
        })
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.status}`);
      }

      const paymentData = await response.json();
      const paymentStatus = paymentData.status_code === 2 ? 'completed' : 'failed';

      // Update order in database
      await pool.query(
        `UPDATE orders 
         SET payment_status = $1, 
             payment_reference = $2, 
             status = $3, 
             updated_at = NOW() 
         WHERE id = $4`,
        [paymentStatus, paymentId, paymentStatus === 'completed' ? 'processing' : 'failed', orderId]
      );

      // // Log payment details
      // await pool.query(
      //   `INSERT INTO payment_logs (
      //     order_id,
      //     payment_id,
      //     status,
      //     amount,
      //     currency,
      //     payment_method,
      //     log_data,
      //     created_at
      //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      //   [
      //     orderId,
      //     paymentId,
      //     paymentStatus,
      //     paymentData.payhere_amount,
      //     paymentData.payhere_currency,
      //     'payhere',
      //     JSON.stringify(paymentData)
      //   ]
      // );

      res.json({
        success: true,
        paymentStatus,
        message: paymentStatus === 'completed' 
          ? 'Payment completed successfully' 
          : 'Payment failed or is pending'
      });
      
    } catch (error) {
      console.error('Error verifying payment status:', error);
      res.status(500).json({ 
        success: false, 
        paymentStatus: 'error',
        message: 'Failed to verify payment status' 
      });
    }
  }

  /**
   * Handle PayHere payment notification (webhook)
   */
  static async handlePaymentNotification(req: Request, res: Response) {
    console.error('Received PayHere notification:', req.body);
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

      // Get secret key from environment
      const secretKey = "MTI2MjEwNjQ3MjI4Mjk1NDEyNzUzMjI5MDIxOTIwMjIwNjQwMjA1OA==";
      if (!secretKey) {
        throw new Error('PayHere secret key not configured');
      }

      // Calculate MD5 hash using the correct format
      const calculatedHash = PaymentController.getMd5(
        merchant_id + 
        order_id + 
        payhere_amount + 
        payhere_currency + 
        status_code + 
        PaymentController.getMd5(secretKey)
      );

      if (calculatedHash !== md5sig) {
        console.error('Invalid MD5 signature in PayHere notification');
        return res.status(403).send('Invalid signature');
      }

      // Map PayHere status codes to application status
      const paymentStatus = status_code === '2' ? 'completed' : 'failed';
      const orderStatus = status_code === '2' ? 'processing' : 'failed';

      // Update order status
      await pool.query(
        `UPDATE orders 
         SET status = $1, 
             payment_status = $2, 
             payment_id = $3, 
             updated_at = NOW() 
         WHERE id = $4`,
        [orderStatus, paymentStatus, payment_id, order_id]
      );

      console.error("Updated values");

      // Log payment notification
      // await pool.query(
      //   `INSERT INTO payment_logs (
      //     order_id,
      //     payment_id,
      //     status,
      //     amount,
      //     currency,
      //     payment_method,
      //     log_data,
      //     created_at
      //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      //   [
      //     order_id,
      //     payment_id,
      //     paymentStatus,
      //     payhere_amount,
      //     payhere_currency,
      //     'payhere',
      //     JSON.stringify(req.body)
      //   ]
      // );

      // Send success response to PayHere
      res.status(200).send('OK');
      
    } catch (error) {
      console.error('Error handling PayHere notification:', error);
      // Always return 200 to avoid PayHere retries, but log the error
      res.status(200).send('OK');
    }
  }

  /**
   * Generate PayHere checkout parameters with proper hash
   */
  static async getPaymentCheckoutParams(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      
      // Define a type for order items
      interface OrderItem {
        productId: number;
        name: string;
        price: number;
        quantity: number;
      }

      // Get order details from database
      const orderResult = await pool.query(
        `SELECT o.*, 
                CASE WHEN gc.order_id IS NOT NULL THEN 
                  json_build_object(
                    'firstName', gc.first_name,
                    'lastName', gc.last_name,
                    'email', gc.email,
                    'phone', gc.phone
                  )
                ELSE
                  json_build_object(
                    'firstName', u.first_name,
                    'lastName', u.last_name,
                    'email', u.emailaddress,
                    'phone', u.contactno
                  )
                END as customer,
                (SELECT json_agg(json_build_object(
                  'productId', oi.product_id,
                  'name', oi.name,
                  'price', oi.price,
                  'quantity', oi.quantity
                )) FROM order_items oi WHERE oi.order_id = o.id) as items,
                (SELECT oa FROM order_addresses oa WHERE oa.order_id = o.id AND oa.address_type = 'shipping' LIMIT 1) as shipping_address
         FROM orders o
         LEFT JOIN guest_customers gc ON o.id = gc.order_id
         LEFT JOIN user_orders uo ON o.id = uo.order_id
         LEFT JOIN customers u ON uo.customerid = u.customerid
         WHERE o.id = $1`,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const order = orderResult.rows[0];
      const customer = order.customer;
      const shippingAddress = order.shipping_address;
      
      // Get PayHere credentials from environment
      const merchantId = process.env.PAYHERE_MERCHANT_ID || 1230460;
      const secretKey = process.env.PAYHERE_SECRET_KEY || "MTI2MjEwNjQ3MjI4Mjk1NDEyNzUzMjI5MDIxOTIwMjIwNjQwMjA1OA==";
      
      if (!merchantId || !secretKey) {
        return res.status(500).json({ message: 'Payment gateway configuration error' });
      }

      // Frontend URL - use environment variable or default to localhost:5173 (Vite default)
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      // Format amount to 2 decimal places
      const amount = Number(order.total_amount).toFixed(2);
      
      // Prepare PayHere parameters
      const payHereParams = {
        merchant_id: merchantId,
        return_url: `http://localhost:8081/payment-complete?order_id=${orderId}`,
        cancel_url: `http://localhost:8081/checkout`,
        notify_url: `https://98df-2402-d000-a400-da2d-7939-f9d5-726c-6d75.ngrok-free.app/api/payments/notify`,
        
        order_id: orderId,
        items: (order.items as OrderItem[]).map((item) => item.name).join(', '),
        currency: 'LKR',
        amount: amount,
        
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        
        address: shippingAddress?.street1 || '',
        city: shippingAddress?.city || '',
        country: shippingAddress?.country || 'Sri Lanka',
        
        delivery_address: shippingAddress?.street1 || '',
        delivery_city: shippingAddress?.city || '',
        delivery_country: shippingAddress?.country || 'Sri Lanka',
      };
      
      // Generate hash for checkout using MD5 as per sample
      const hash = PaymentController.getMd5(
        merchantId + 
        orderId + 
        amount + 
        'LKR' + 
        PaymentController.getMd5(secretKey)
      );
      
      // Return PayHere parameters with hash
      res.json({
        ...payHereParams,
        hash
      });
      
    } catch (error) {
      console.error('Error generating PayHere checkout parameters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  /**
   * Utility method to generate PayHere hash for API requests
   * This is still used for some API calls that might require the previous format
   */
  private static generatePayHereHash(data: Record<string, string>, secretKey: string): string {
    // Sort and filter data for consistent hash generation
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        if (key !== 'hash' && data[key] !== '') {
          acc[key] = data[key];
        }
        return acc;
      }, {} as Record<string, string>);

    // Create hash string by joining key-value pairs
    const hashString = Object.entries(sortedData)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    // Generate SHA1 hash with merchant secret
    return crypto
      .createHash('sha1')
      .update(hashString + secretKey)
      .digest('hex');
  }
  
  /**
   * Utility method to generate MD5 hash as per PayHere specifications
   * Based on the provided Java sample
   */
  private static getMd5(input: string): string {
    const md5Hash = crypto.createHash('md5').update(input).digest('hex');
    return md5Hash.toUpperCase();
  }
}