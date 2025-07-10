// mobile/src/services/paymentService.ts
import apiClient from './apiClient';

export const createPaymentIntent = async (listingId: string): Promise<{ clientSecret: string; orderId: string }> => {
  const response = await apiClient.post('/payments/create-payment-intent', { listingId });
  return response.data;
};

export const confirmPayment = async (paymentIntentId: string): Promise<any> => {
  const response = await apiClient.post('/payments/confirm-payment', { paymentIntentId });
  return response.data;
};
