// backend/src/controllers/chatController.ts
import { Request, Response } from 'express';
import * as chatService from '../services/chatService';

export const getConversations = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const conversations = await chatService.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting conversations', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting conversations', error: 'Unknown error' });
    }
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  const userId1 = req.user!.id;
  const { userId2 } = req.params;

  try {
    const history = await chatService.getChatHistory(userId1, userId2);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error getting chat history:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Server error getting chat history', error: error.message });
    } else {
        res.status(500).json({ message: 'Server error getting chat history', error: 'Unknown error' });
    }
  }
};
