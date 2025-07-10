// backend/src/routes/reviewRoutes.ts
import express, { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', reviewController.createReview);
router.get('/:technicianId', reviewController.getReviewsForTechnician);

export default router;
