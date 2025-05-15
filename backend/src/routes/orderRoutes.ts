import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomer,
  getOrdersByStatus,
  processOrderPayment,
  verifyPaymentStatus
} from '../controllers/orderController';

const router = Router();

// GET routes
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/customer/:customerId', getOrdersByCustomer);
router.get('/status/:status', getOrdersByStatus);

// POST routes
router.post('/:orderId/payment', processOrderPayment);

// PUT route
router.put('/:id', updateOrder);

// DELETE route
router.delete('/:id', deleteOrder);

// Payment verification
router.get('/payments/:paymentId/verify', verifyPaymentStatus);

export default router;