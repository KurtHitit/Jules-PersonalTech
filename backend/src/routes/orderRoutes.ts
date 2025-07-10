// backend/src/routes/orderRoutes.ts
import express, { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/my-orders', orderController.getBuyerOrders);
router.get('/my-sales', orderController.getSellerOrders);

export default router;
