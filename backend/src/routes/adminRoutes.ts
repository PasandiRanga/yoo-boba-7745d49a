import { Router } from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAllOrdersForAdmin,
  updateOrderStatusAdmin,
  getAllProductsWithDetails,
  updateProductStock,
  updateProductPrice,
  addNewProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController';
import { authRateLimit } from '../middleware/security';

const router = Router();

// Authentication routes with rate limiting
router.post('/register', authRateLimit, registerAdmin);
router.post('/login', authRateLimit, loginAdmin);

// Order management routes
router.get('/orders', getAllOrdersForAdmin);
router.patch('/orders/:orderId/status', updateOrderStatusAdmin);

// Product management routes
router.get('/products', getAllProductsWithDetails);
router.post('/products', addNewProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// Stock and price management
router.patch('/products/stock', updateProductStock);
router.patch('/products/price', updateProductPrice);

export default router;