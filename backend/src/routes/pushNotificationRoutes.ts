// backend/src/routes/pushNotificationRoutes.ts
import express, { Router } from 'express';
import * as pushNotificationController from '../controllers/pushNotificationController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/register', pushNotificationController.registerToken);

export default router;
