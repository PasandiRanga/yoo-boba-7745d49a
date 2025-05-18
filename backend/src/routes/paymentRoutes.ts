import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';

const router = Router();

// Generate PayHere checkout parameters
router.get('/checkout-params/:orderId', PaymentController.getPaymentCheckoutParams);

// Verify payment status
router.post('/verify', PaymentController.verifyPayment);

// Handle payment notifications from PayHere (webhook)
router.post('/notify', PaymentController.handlePaymentNotification);



export default router;