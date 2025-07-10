// mobile/src/services/reviewService.ts
import apiClient from './apiClient';
import { IReview } from '../../../backend/src/models/Review';

export type Review = IReview;

export const createReview = async (technicianId: string, rating: number, comment?: string): Promise<Review> => {
  const response = await apiClient.post('/reviews', { technicianId, rating, comment });
  return response.data;
};

export const getReviewsForTechnician = async (technicianId: string): Promise<Review[]> => {
  const response = await apiClient.get(`/reviews/${technicianId}`);
  return response.data;
};
