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

const router = Router();
//Login 
router.post('/login', loginCustomer);

// Password reset routes
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

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