// backend/src/services/reviewService.ts
import Review, { IReview } from '../models/Review';
import Technician from '../models/Technician';

import { checkAndAwardBadges } from './badgeService';

export const createReview = async (technicianId: string, userId: string, rating: number, comment?: string): Promise<IReview> => {
  const review = new Review({
    technician: technicianId,
    user: userId,
    rating,
    comment,
  });
  await review.save();

  // Update technician's average rating and review count
  const technician = await Technician.findById(technicianId);
  if (technician) {
    const reviews = await Review.find({ technician: technicianId });
    const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
    technician.rating = totalRating / reviews.length;
    technician.reviewCount = reviews.length;
    await technician.save();
  }

  // Check for badges
  await checkAndAwardBadges(userId, 'add_first_review');

  return review;
};

export const getReviewsForTechnician = async (technicianId: string): Promise<IReview[]> => {
  return Review.find({ technician: technicianId }).populate('user', 'firstName lastName');
};
