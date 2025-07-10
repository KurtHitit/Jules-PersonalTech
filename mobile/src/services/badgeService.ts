// mobile/src/services/badgeService.ts
import apiClient from './apiClient';
import { IBadge } from '../../../backend/src/models/Badge';
import { IUserBadge } from '../../../backend/src/models/UserBadge';

export type Badge = IBadge;
export type UserBadge = IUserBadge;

export const getAllBadges = async (): Promise<Badge[]> => {
  const response = await apiClient.get('/badges');
  return response.data;
};

export const getUserBadges = async (): Promise<UserBadge[]> => {
  const response = await apiClient.get('/badges/my-badges');
  return response.data;
};
