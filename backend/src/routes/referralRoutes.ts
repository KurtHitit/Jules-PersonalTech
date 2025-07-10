// backend/src/routes/referralRoutes.ts
import express, { Router } from 'express';
import * as referralController from '../controllers/referralController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/my-code', referralController.getMyReferralCode);
router.get('/validate', referralController.validateReferralCode);

export default router;
