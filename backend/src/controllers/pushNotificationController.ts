// backend/src/controllers/pushNotificationController.ts
import { Request, Response } from 'express';
import * as pushNotificationService from '../services/pushNotificationService';

export const registerToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  const userId = req.user!.id;

  if (!token) {
    res.status(400).json({ message: 'Push token is required.' });
    return;
  }

  try {
    await pushNotificationService.registerPushToken(userId, token);
    res.status(200).json({ message: 'Token registered successfully' });
  } catch (error) {
    console.error('Error registering push token:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error registering push token', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error registering push token', error: 'Unknown error' });
    }
  }
};
