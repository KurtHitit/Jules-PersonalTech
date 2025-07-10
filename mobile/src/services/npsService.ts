// mobile/src/services/npsService.ts
import apiClient from './apiClient';

export const submitNPS = async (score: number, feedback?: string): Promise<any> => {
  const response = await apiClient.post('/nps', { score, feedback });
  return response.data;
};
