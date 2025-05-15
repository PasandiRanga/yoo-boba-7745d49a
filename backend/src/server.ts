import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes'; // Assuming you have order routes in productRoutes
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/payments', paymentRoutes); 
app.use('/api/orders', orderRoutes); // Assuming you have order routes in productRoutes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
