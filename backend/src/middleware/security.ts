import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Environment validation middleware
export const validateEnvironment = (req: Request, res: Response, next: NextFunction): void => {
  const requiredEnvVars = [
    'JWT_SECRET',
    'PAYHERE_MERCHANT_ID',
    'PAYHERE_MERCHANT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
    return;
  }

  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password reset
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sanitize sensitive data for logging
export const sanitizeForLogging = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sensitiveFields = [
    'password', 'secret', 'key', 'token', 'hash', 'signature',
    'merchant_secret', 'payhere_secret', 'jwt_secret'
  ];

  const sanitized = { ...data };
  
  Object.keys(sanitized).forEach(key => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      sanitized[key] = '[REDACTED]';
    }
  });

  return sanitized;
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Remove server header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};