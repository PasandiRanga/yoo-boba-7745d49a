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

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
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
