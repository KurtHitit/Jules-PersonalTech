// backend/src/routes/npsRoutes.ts
import express, { Router } from 'express';
import * as npsController from '../controllers/npsController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.post('/', npsController.submitNPS);

export default router;
