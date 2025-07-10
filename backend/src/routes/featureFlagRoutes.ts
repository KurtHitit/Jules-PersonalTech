// backend/src/routes/featureFlagRoutes.ts
import express, { Router } from 'express';
import * as featureFlagController from '../controllers/featureFlagController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/', featureFlagController.getAllFeatureFlags);
router.get('/:name', featureFlagController.getFeatureFlag);
router.put('/:name', featureFlagController.setFeatureFlag); // Admin/Moderator route

export default router;
