// backend/src/services/notificationService.ts
import Notification, { INotification } from '../models/Notification';
import { sendPushNotification } from './pushNotificationService';

export const createNotification = async (userId: string, type: INotification['type'], message: string, link?: string, relatedEntityId?: string): Promise<INotification> => {
  const notification = new Notification({
    userId,
    type,
    message,
    link,
    relatedEntityId,
  });
  await notification.save();

  // Send push notification
  await sendPushNotification(userId, { title: 'New Notification', body: message });

  return notification;
};

export const getNotifications = async (userId: string, read?: boolean): Promise<INotification[]> => {
  const query: any = { userId };
  if (typeof read === 'boolean') {
    query.read = read;
  }
  return Notification.find(query).sort({ createdAt: -1 });
};

export const markNotificationAsRead = async (notificationId: string): Promise<INotification | null> => {
  return Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
};
