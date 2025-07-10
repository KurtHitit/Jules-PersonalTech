// backend/src/controllers/badgeController.ts
import { Request, Response } from 'express';
import * as badgeService from '../services/badgeService';

export const getUserBadges = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const userBadges = await badgeService.getUserBadges(userId);
    res.status(200).json(userBadges);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting user badges', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting user badges', error: 'Unknown error' });
    }
  }
};

export const getAllBadges = async (req: Request, res: Response): Promise<void> => {
  try {
    const allBadges = await badgeService.getAllBadges();
    res.status(200).json(allBadges);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting all badges', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting all badges', error: 'Unknown error' });
    }
  }
};
