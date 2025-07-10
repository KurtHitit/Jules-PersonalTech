// mobile/src/screens/ConversationListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import * as chatService from '../services/chatService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '../navigation/types';

type ConversationListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ConversationList'>;

interface Props {
  navigation: ConversationListScreenNavigationProp;
}

const ConversationListScreen: React.FC<Props> = ({ navigation }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const fetchedConversations = await chatService.getConversations();
      setConversations(fetchedConversations);
      setLoading(false);
    };
    fetchConversations();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.with._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { userId: item.with._id, name: `${item.with.firstName} ${item.with.lastName}` })}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.with.firstName} {item.with.lastName}</Text>
              <Text>{item.lastMessage.message}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default ConversationListScreen;
