// server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cartRoutes from './routes/cartRoutes';
import byobRoutes from './routes/byobRoutes';
import contactRoutes from './routes/contactRoutes';
import adminRoutes from './routes/adminRoutes';

import { 
  generalRateLimit, 
  authRateLimit, 
  securityHeaders, 
  sanitizeInput, 
  validateEnvironment 
} from './middleware/security';

// Load environment variables
dotenv.config();

// Validate environment variables on startup
validateEnvironment();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(securityHeaders);

// CORS configuration - restrict to specific origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'http://localhost:8081']
    : ['http://localhost:8081', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.urlencoded({ extended: true })); // ✅ Needed for PayHere
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/byob', byobRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
