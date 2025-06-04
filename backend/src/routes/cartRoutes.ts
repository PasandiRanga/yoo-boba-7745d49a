// routes/cartRoutes.js
import { Router } from 'express';

import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart,
  removeOrderedItems
} from '../controllers/cartController';

// Middleware to verify JWT token (assuming you have this)
import authenticateToken from '../middleware/auth';

const router = Router();

// Get cart items for a customer
router.get('/:customerId', authenticateToken, getCartItems);

// Add item to cart
router.post('/add', authenticateToken, addToCart);

// Update cart item quantity
router.put('/update', authenticateToken, updateCartItem);

// Remove specific item from cart
router.delete('/:customerId/:productId', authenticateToken, removeCartItem);

// Clear entire cart
router.delete('/clear/:customerId', authenticateToken, clearCart);

// Sync localStorage cart to database
router.post('/sync', authenticateToken, syncCart);

// Remove ordered items from cart
router.post('/remove-ordered', authenticateToken, removeOrderedItems);

export default router;