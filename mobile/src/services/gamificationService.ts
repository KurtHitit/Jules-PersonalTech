// mobile/src/services/gamificationService.ts
import apiClient from './apiClient';
import { IGamification } from '../../../backend/src/models/Gamification';

export type GamificationData = IGamification;

export const getGamificationData = async (): Promise<GamificationData> => {
  const response = await apiClient.get('/gamification');
  return response.data;
};

export const getGoodOwnerScore = async (): Promise<{ score: number }> => {
  const response = await apiClient.get('/gamification/good-owner-score');
  return response.data;
};
