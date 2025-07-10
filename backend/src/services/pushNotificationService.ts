// backend/src/services/pushNotificationService.ts
import PushToken, { IPushToken } from '../models/PushToken';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export const registerPushToken = async (userId: string, token: string): Promise<IPushToken> => {
  console.log(`[PushNotificationService] Registering push token for user ${userId}`);
  const existingToken = await PushToken.findOne({ token });
  if (existingToken) {
    console.log(`[PushNotificationService] Token already registered for user ${existingToken.userId}`);
    if ((existingToken.userId as any).toString() !== userId) {
      existingToken.userId = userId as any;
      await existingToken.save();
      console.log(`[PushNotificationService] Token updated for user ${userId}`);
    }
    return existingToken;
  }

  const newToken = new PushToken({ userId, token });
  await newToken.save();
  console.log(`[PushNotificationService] New token registered for user ${userId}`);
  return newToken;
};

export const sendPushNotification = async (userId: string, message: Partial<ExpoPushMessage>): Promise<void> => {
  const pushTokens = await PushToken.find({ userId });

  if (pushTokens.length === 0) {
    console.log(`[PushNotificationService] No push tokens found for user ${userId}`);
    return;
  }

  const messages: ExpoPushMessage[] = [];
  for (const pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken.token)) {
      console.error(`Push token ${pushToken.token} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken.token,
      sound: 'default',
      ...message,
    });
  }

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }

  // TODO: Handle tickets for error reporting and token removal
};
