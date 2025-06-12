// server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cartRoutes from './routes/cartRoutes';
import byobRoutes from './routes/byobRoutes';
import contactRoutes from './routes/contactRoutes';
import adminRoutes from './routes/adminRoutes';

// Security middleware imports
import { 
  generalRateLimit, 
  authRateLimit, 
  securityHeaders, 
  sanitizeInput, 
  requestSizeLimit,
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
app.use(requestSizeLimit);

// CORS configuration - restrict to specific origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // ✅ Needed for PayHere
app.use(express.json({ limit: '10mb' }));

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
