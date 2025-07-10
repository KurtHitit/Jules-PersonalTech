// backend/src/routes/badgeRoutes.ts
import express, { Router } from 'express';
import * as badgeController from '../controllers/badgeController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/', badgeController.getAllBadges);
router.get('/my-badges', badgeController.getUserBadges);

export default router;
