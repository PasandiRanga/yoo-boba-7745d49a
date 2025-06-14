import { Router } from 'express'; 
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders,
  loginCustomer,
  requestPasswordReset,
  resetPassword
} from '../controllers/customerController';
import { authRateLimit, passwordResetRateLimit } from '../middleware/security';

const router = Router();
//Login with rate limiting
router.post('/login', authRateLimit, loginCustomer);

// Password reset routes with rate limiting
router.post('/forgot-password', passwordResetRateLimit, requestPasswordReset);
router.post('/reset-password', authRateLimit, resetPassword);

// GET routes
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/orders', getCustomerOrders);

// POST route
router.post('/', createCustomer);

// PUT route
router.put('/:id', updateCustomer);

// DELETE route
router.delete('/:id', deleteCustomer);




export default router;