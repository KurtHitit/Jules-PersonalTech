// mobile/src/services/orderService.ts
import apiClient from './apiClient';
import { IOrder } from '../../../backend/src/models/Order';

export type Order = IOrder;

export const getBuyerOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders/my-orders');
  return response.data;
};

export const getSellerOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders/my-sales');
  return response.data;
};
