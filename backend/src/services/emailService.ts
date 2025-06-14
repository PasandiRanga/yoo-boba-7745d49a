import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
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
    return { success: false, error: error.message };
  }
};