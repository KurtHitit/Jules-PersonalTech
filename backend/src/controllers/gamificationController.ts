// backend/src/controllers/gamificationController.ts
import { Request, Response } from 'express';
import * as gamificationService from '../services/gamificationService';

export const getGamificationData = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const gamificationData = await gamificationService.getGamificationData(userId);
    res.status(200).json(gamificationData);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting gamification data', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting gamification data', error: 'Unknown error' });
    }
  }
};

export const getGoodOwnerScore = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const score = await gamificationService.calculateGoodOwnerScore(userId);
    res.status(200).json({ score });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting good owner score', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting good owner score', error: 'Unknown error' });
    }
  }
};
