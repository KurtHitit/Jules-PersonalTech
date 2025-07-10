// mobile/src/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '@/navigation/types';
import * as chatService from '@/services/chatService';


type ChatScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'Chat'>;
import { useAuth } from '@/context/AuthContext';
import { showToast } from '../services/toastService';
import { getAuthToken } from '@/services/authService';

type ChatScreenRouteProp = RouteProp<MainAppStackParamList, 'Chat'>;

interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { userId, name } = route.params; // Now expecting userId and name
  const [messages, setMessages] = useState<chatService.Message[]>([]);
  const [message, setMessage] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuth(); // Get current user from AuthContext

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user?.id) return; // Ensure current user ID is available
      const chatHistory = await chatService.getChatHistory(userId);
      setMessages(chatHistory);
    };

    fetchChatHistory();

    const connectWebSocket = async () => {
      const token = await getAuthToken();
      if (!token) {
        console.error('No auth token found for WebSocket connection.');
        return;
      }
      // Connect to WebSocket with token for authentication
      ws.current = new WebSocket(`ws://localhost:3000?token=${token}`);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (e) => {
        const received = JSON.parse(e.data);
        if (received.type === 'chat_message') {
          const receivedMessage = received.data;
          // Only add message if it's relevant to the current chat
          if (receivedMessage.senderId === userId || receivedMessage.receiverId === userId) {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
        } else if (received.type === 'badge_earned') {
          showToast(`Badge earned: ${received.data.badgeName}`);
        }
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket error:', e);
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
      };
    };

    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [userId, user?.id]);

  const sendMessage = async () => {
    if (message.trim() && user?.id) {
      try {
        // Send message via WebSocket for real-time delivery
        ws.current?.send(JSON.stringify({ receiverId: userId, content: message }));
        // Also save message via REST API for persistence and push notifications
        const savedMessage = await chatService.sendMessage(userId, message);
        setMessages((prevMessages) => [...prevMessages, savedMessage]);
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        testID="chat-messages-list"
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          testID="chat-input"
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', marginRight: 10, padding: 5 }}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity testID="send-message-button" onPress={sendMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
