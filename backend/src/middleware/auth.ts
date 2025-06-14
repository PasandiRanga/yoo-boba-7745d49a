import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define the expected shape of your JWT payload
interface UserPayload extends JwtPayload {
  id: string;
  email: string;
  // Add more fields if your JWT includes them
}

// Module augmentation to add 'user' to Express's Request type
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required',
    });
    return;
  }

  // Ensure JWT secret is configured
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error('JWT_SECRET environment variable is not configured');
    res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
    return;
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !decoded) {
      res.status(403).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    req.user = decoded as UserPayload;
    next();
  });
};

export default authenticateToken;
