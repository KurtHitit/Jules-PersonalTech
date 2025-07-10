// backend/src/controllers/npsController.ts
import { Request, Response } from 'express';
import * as npsService from '../services/npsService';

export const submitNPS = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { score, feedback } = req.body;

  if (typeof score !== 'number' || score < 0 || score > 10) {
    res.status(400).json({ message: 'Score must be a number between 0 and 10.' });
    return;
  }

  try {
    const newFeedback = await npsService.submitNPS(userId, score, feedback);
    res.status(201).json({ message: 'NPS feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error submitting NPS feedback', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error submitting NPS feedback', error: 'Unknown error' });
    }
  }
};
