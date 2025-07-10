// backend/src/routes/gamificationRoutes.ts
import express, { Router } from 'express';
import * as gamificationController from '../controllers/gamificationController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/', gamificationController.getGamificationData);
router.get('/good-owner-score', gamificationController.getGoodOwnerScore);

export default router;
