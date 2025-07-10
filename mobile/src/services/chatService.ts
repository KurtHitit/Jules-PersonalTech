'''// mobile/src/services/chatService.ts
import apiClient from './apiClient';
import { IMessage } from '../../../backend/src/models/Message';

export type Message = IMessage;

export const getConversations = async (): Promise<any[]> => {
  const response = await apiClient.get('/chat/conversations');
  return response.data;
};

export const getChatHistory = async (userId: string): Promise<Message[]> => {
  try {
    const response = await apiClient.get<Message[]>(`/chat/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
  const response = await apiClient.post('/chat/send', { receiverId, content });
  return response.data;
};
''
