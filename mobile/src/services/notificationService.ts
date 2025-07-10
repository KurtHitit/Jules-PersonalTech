// mobile/src/services/notificationService.ts
import apiClient from './apiClient';
import { INotification } from '../../../backend/src/models/Notification';

export type Notification = INotification;

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await apiClient.put(`/notifications/${notificationId}/read`);
  return response.data;
};
