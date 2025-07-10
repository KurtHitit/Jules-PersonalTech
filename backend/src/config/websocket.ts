// backend/src/config/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import url from 'url';
import { saveMessage } from '../services/chatService';
import { verifyToken } from '../utils/jwtUtils';

const clients = new Map<string, WebSocket>();

export const getClient = (userId: string) => {
  return clients.get(userId);
};

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req) => {
    const parameters = new url.URL(req.url!, `http://${req.headers.host}`).searchParams;
    const token = parameters.get('token');

    if (!token) {
      ws.close(1008, 'Token required');
      return;
    }

    try {
      const decoded = verifyToken(token);
      const userId = decoded.userId;
      clients.set(userId, ws);

      console.log(`Client connected: ${userId}`);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'chat_message') {
            const { receiverId, content } = data;
            const savedMessage = await saveMessage({
              senderId: userId,
              receiverId,
              message: content,
              senderModel: 'User',
              receiverModel: 'User',
            });

            const receiverWs = clients.get(receiverId);
            if (receiverWs) {
              receiverWs.send(JSON.stringify({ type: 'chat_message', data: savedMessage }));
            }
          } else if (data.type === 'badge_earned') {
            // This part is handled on the client side, but keeping the structure for completeness
            // The backend emits this, the client listens.
          }
        } catch (error) {
          console.error('Failed to process message:', error);
        }
      });

      ws.on('close', () => {
        clients.delete(userId);
        console.log(`Client disconnected: ${userId}`);
      });

    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  });
};
