// backend/src/controllers/notificationController.ts
import { Request, Response } from 'express';
import * as notificationService from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;
  const { read } = req.query;

  try {
    const notifications = await notificationService.getNotifications(userId, read === 'true' ? true : read === 'false' ? false : undefined);
    res.status(200).json(notifications);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting notifications', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting notifications', error: 'Unknown error' });
    }
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const { notificationId } = req.params;

  try {
    const notification = await notificationService.markNotificationAsRead(notificationId);
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error marking notification as read', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error marking notification as read', error: 'Unknown error' });
    }
  }
};
