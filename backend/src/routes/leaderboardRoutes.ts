// backend/src/routes/leaderboardRoutes.ts
import express, { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboardController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.use(protect);

router.get('/', leaderboardController.getLeaderboard);

export default router;
