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
  deleteProduct,
  getAllCustomers
} from '../controllers/adminController';

const router = Router();

// Authentication routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Order management routes
router.get('/orders', getAllOrdersForAdmin);
router.patch('/orders/:orderId/status', updateOrderStatusAdmin);

// Customer management routes
router.get('/customers', getAllCustomers);

// Product management routes
router.get('/products', getAllProductsWithDetails);
router.post('/products', addNewProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

// Stock and price management
router.patch('/products/stock', updateProductStock);
router.patch('/products/price', updateProductPrice);

export default router;