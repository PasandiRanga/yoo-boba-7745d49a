import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getOrdersByCustomerId,
  cancelOrder
} from '../controllers/orderController';

const router = Router();

// Create a pending order (keeping original route path for backward compatibility)
router.post('/create-pending', createOrder);

// Get order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

// Additional routes that match the CustomerController pattern
// Get all orders
router.get('/', getAllOrders);

// Delete order
router.delete('/:id', deleteOrder);

// Get orders by customer ID
// Note: This needs to come before '/:id' route to avoid being interpreted as an order ID
router.get('/customer/:customerId', getOrdersByCustomerId);

// Cancel order
router.post('/:id/cancel', cancelOrder);

export default router;