// File: routes/paymentRoutes.ts

import { Router } from 'express';
import {
  initializePayment,
  handlePaymentNotification,
  getPaymentStatus
} from '../controllers/paymentController';

const router = Router();

// Initialize payment
router.post('/initialize', initializePayment);

// PayHere notification webhook
router.post('/notify', handlePaymentNotification);

// Get payment status
router.get('/status/:orderId', getPaymentStatus);

export default router;