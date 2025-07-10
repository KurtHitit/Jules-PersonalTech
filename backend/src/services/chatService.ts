// backend/src/services/chatService.ts
import Message, { IMessage } from '../models/Message';
import { sendPushNotification } from './pushNotificationService';

export const getConversations = async (userId: string): Promise<any[]> => {
  const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] })
    .sort({ createdAt: -1 })
    .populate('senderId', 'firstName lastName')
    .populate('receiverId', 'firstName lastName');

  const conversations = messages.reduce((acc, msg) => {
    const sender = msg.senderId as any; // Cast to any for now, or define a more specific populated type
    const receiver = msg.receiverId as any; // Cast to any

    const otherUser = sender._id.toString() === userId ? receiver : sender;
    if (!acc[otherUser._id.toString()]) {
      acc[otherUser._id.toString()] = {
        with: otherUser,
        lastMessage: msg,
      };
    }
    return acc;
  }, {} as any);

  return Object.values(conversations);
};

export const getChatHistory = async (userId1: string, userId2: string): Promise<IMessage[]> => {
  return Message.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 },
    ],
  }).sort({ createdAt: 1 });
};

export const saveMessage = async (message: { senderId: string; receiverId: string; message: string; senderModel: string; receiverModel: string; }): Promise<IMessage> => {
  const newMessage = new Message(message);
  await newMessage.save();

  // Send a push notification to the receiver
  await sendPushNotification((newMessage.receiverId as any).toString(), {
    title: 'New Message',
    body: message.message,
  });

  return newMessage;
};
