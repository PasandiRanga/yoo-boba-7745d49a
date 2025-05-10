import { Router } from 'express'; 
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerOrders
} from '../controllers/customerController';

const router = Router();

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