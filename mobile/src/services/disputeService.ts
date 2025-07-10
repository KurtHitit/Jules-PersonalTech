// mobile/src/services/disputeService.ts
import apiClient from './apiClient';
import { IDispute } from '../../../backend/src/models/Dispute';

export type Dispute = IDispute;

export const createDispute = async (orderId: string, reason: string, description?: string): Promise<Dispute> => {
  const response = await apiClient.post('/disputes', { orderId, reason, description });
  return response.data;
};

export const getUserDisputes = async (): Promise<Dispute[]> => {
  const response = await apiClient.get('/disputes/my-disputes');
  return response.data;
};
