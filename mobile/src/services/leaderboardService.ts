// mobile/src/services/leaderboardService.ts
import apiClient from './apiClient';

export interface LeaderboardEntry {
  _id: string;
  firstName: string;
  lastName: string;
  xp: number;
  level: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const response = await apiClient.get('/leaderboard');
  return response.data;
};
