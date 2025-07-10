// backend/src/routes/notificationRoutes.ts
import express, { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);

export default router;
