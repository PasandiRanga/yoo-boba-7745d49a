import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your email password or app password
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  customerName: string
) => {
  try {
    const transporter = createTransporter();
    
    // Create reset URL - adjust this to match your frontend URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    // Email template
    const mailOptions = {
      from: `"Yoo Boba" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset Request - Yoo Boba',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #9333ea, #ec4899); 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 25px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧋 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello ${customerName},</p>
              
              <p>We received a request to reset your password for your Yoo Boba account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Your Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Never share this link with anyone</li>
                </ul>
              </div>
              
              <p>If you have any questions or need help, please contact our support team.</p>
              
              <p>Best regards,<br>The Yoo Boba Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Yoo Boba. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Fallback text version
      text: `
        Hello ${customerName},

        We received a request to reset your password for your Yoo Boba account.
        
        To reset your password, visit this link: ${resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        The Yoo Boba Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

// Send welcome email (optional)
export const sendWelcomeEmail = async (email: string, customerName: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Yoo Boba" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Yoo Boba! 🧋',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Yoo Boba</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧋 Welcome to Yoo Boba!</h1>
            </div>
            <div class="content">
              <p>Hello ${customerName},</p>
              
              <p>Welcome to Yoo Boba! We're excited to have you join our bubble tea community.</p>
              
              <p>You can now:</p>
              <ul>
                <li>🛒 Browse our premium tapioca pearls</li>
                <li>🎨 Build Your Own Boba (BYOB)</li>
                <li>📦 Track your orders</li>
                <li>💫 Enjoy exclusive member benefits</li>
              </ul>
              
              <p>Thank you for choosing Yoo Boba for your bubble tea needs!</p>
              
              <p>Best regards,<br>The Yoo Boba Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Yoo Boba. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};

// Send order receipt email
export const sendOrderReceiptEmail = async (
  email: string,
  customerName: string,
  orderData: {
    orderId: string;
    totalAmount: number;
    paymentMethod: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    billingAddress: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }
) => {
  try {
    const transporter = createTransporter();
    console.error("Sending order receipt email to:", email);
    // Calculate subtotal and format items
    const subtotal = orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemsHtml = orderData.items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px; text-align: left;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    const mailOptions = {
      from: `"Yoo Boba" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Order Confirmation #${orderData.orderId} - Yoo Boba 🧋`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #9333ea, #ec4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .order-summary { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .address-section { display: inline-block; width: 48%; vertical-align: top; margin: 10px 0; }
            .address-box { background: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f3f4f6; padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; }
            .total-row { background: #f9f9f9; font-weight: bold; }
            .highlight { color: #9333ea; font-weight: bold; }
            @media (max-width: 600px) {
              .address-section { width: 100%; display: block; }
              .items-table th, .items-table td { padding: 8px 4px; font-size: 14px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧋 Order Confirmation</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order!</p>
            </div>
            
            <div class="content">
              <p>Hello ${customerName},</p>
              
              <p>Thank you for your order! We're excited to get your bubble tea essentials to you. Here are your order details:</p>
              
              <div class="order-summary">
                <h3 style="margin-top: 0; color: #9333ea;">Order Summary</h3>
                <p><strong>Order ID:</strong> <span class="highlight">#${orderData.orderId}</span></p>
                <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
                <p><strong>Total Amount:</strong> <span class="highlight">$${orderData.totalAmount.toFixed(2)}</span></p>
              </div>
              
              <h3>Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 15px; text-align: right;">Subtotal:</td>
                    <td style="padding: 15px; text-align: right;">$${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="3" style="padding: 15px; text-align: right; font-size: 18px; color: #9333ea;">Total:</td>
                    <td style="padding: 15px; text-align: right; font-size: 18px; color: #9333ea;">$${orderData.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Shipping & Billing Information</h3>
              <div style="overflow: auto;">
                <div class="address-section">
                  <div class="address-box">
                    <h4 style="margin-top: 0; color: #9333ea;">Shipping Address</h4>
                    <p style="margin: 5px 0;">${orderData.shippingAddress.street1}</p>
                    ${orderData.shippingAddress.street2 ? `<p style="margin: 5px 0;">${orderData.shippingAddress.street2}</p>` : ''}
                    <p style="margin: 5px 0;">${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}</p>
                    <p style="margin: 5px 0;">${orderData.shippingAddress.country}</p>
                  </div>
                </div>
                
                <div class="address-section" style="margin-left: 4%;">
                  <div class="address-box">
                    <h4 style="margin-top: 0; color: #9333ea;">Billing Address</h4>
                    <p style="margin: 5px 0;">${orderData.billingAddress.street1}</p>
                    ${orderData.billingAddress.street2 ? `<p style="margin: 5px 0;">${orderData.billingAddress.street2}</p>` : ''}
                    <p style="margin: 5px 0;">${orderData.billingAddress.city}, ${orderData.billingAddress.state} ${orderData.billingAddress.zipCode}</p>
                    <p style="margin: 5px 0;">${orderData.billingAddress.country}</p>
                  </div>
                </div>
              </div>
              
              <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>📦 What's Next?</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Your order is being processed and will be shipped within 1-2 business days</li>
                  <li>You'll receive a shipping confirmation email with tracking information</li>
                  <li>If you have any questions, please contact our support team</li>
                </ul>
              </div>
              
              <p>Thank you for choosing Yoo Boba! We hope you enjoy your bubble tea experience.</p>
              
              <p>Best regards,<br>The Yoo Boba Team</p>
            </div>
            
            <div class="footer">
              <p>© 2025 Yoo Boba. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
              <p>For support, please contact us through our website.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Fallback text version
      text: `
        Order Confirmation #${orderData.orderId} - Yoo Boba

        Hello ${customerName},

        Thank you for your order! Here are your order details:

        Order ID: #${orderData.orderId}
        Payment Method: ${orderData.paymentMethod}
        Total Amount: $${orderData.totalAmount.toFixed(2)}

        Items:
        ${orderData.items.map(item => 
          `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n        ')}

        Shipping Address:
        ${orderData.shippingAddress.street1}
        ${orderData.shippingAddress.street2 || ''}
        ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}
        ${orderData.shippingAddress.country}

        Your order is being processed and will be shipped within 1-2 business days.

        Best regards,
        The Yoo Boba Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order receipt email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('Error sending order receipt email:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
};