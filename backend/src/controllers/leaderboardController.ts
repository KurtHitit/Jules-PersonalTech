// backend/src/controllers/leaderboardController.ts
import { Request, Response } from 'express';
import * as leaderboardService from '../services/leaderboardService';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const leaderboard = await leaderboardService.getLeaderboard();
    res.status(200).json(leaderboard);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting leaderboard', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting leaderboard', error: 'Unknown error' });
    }
  }
};
