// backend/src/controllers/reviewController.ts
import { Request, Response } from 'express';
import * as reviewService from '../services/reviewService';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  const { technicianId, rating, comment } = req.body;
  const userId = req.user!.id;

  try {
    const review = await reviewService.createReview(technicianId, userId, rating, comment);
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error creating review', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error creating review', error: 'Unknown error' });
    }
  }
};

export const getReviewsForTechnician = async (req: Request, res: Response): Promise<void> => {
  const { technicianId } = req.params;

  try {
    const reviews = await reviewService.getReviewsForTechnician(technicianId);
    res.status(200).json(reviews);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting reviews', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting reviews', error: 'Unknown error' });
    }
  }
};
