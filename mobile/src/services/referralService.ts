// mobile/src/services/referralService.ts
import apiClient from './apiClient';

export const getMyReferralCode = async (): Promise<string> => {
  const response = await apiClient.get('/referrals/my-code');
  return response.data.referralCode;
};

export const validateReferralCode = async (code: string): Promise<{ isValid: boolean; userId?: string }> => {
  const response = await apiClient.get('/referrals/validate', { params: { code } });
  return response.data;
};
