// server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { securityHeaders, authRateLimit, passwordResetRateLimit } from './middleware/security';

import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import cartRoutes from './routes/cartRoutes';
import byobRoutes from './routes/byobRoutes';
import contactRoutes from './routes/contactRoutes';
import adminRoutes from './routes/adminRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(securityHeaders);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

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
