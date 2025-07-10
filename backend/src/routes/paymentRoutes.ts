// backend/src/routes/paymentRoutes.ts
import express, { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment);

export default router;
