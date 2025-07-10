// mobile/src/screens/NotificationListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import * as notificationService from '../services/notificationService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '../navigation/types';

type NotificationListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'NotificationList'>;

interface Props {
  navigation: NotificationListScreenNavigationProp;
}

const NotificationListScreen: React.FC<Props> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<notificationService.Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const fetchedNotifications = await notificationService.fetchNotifications();
      setNotifications(fetchedNotifications);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const handlePressNotification = async (notificationId: string, link?: string) => {
    await notificationService.markNotificationAsRead(notificationId);
    // Optionally navigate to the link
    if (link) {
      // Handle navigation based on the link (e.g., to a specific forum thread)
      console.log('Navigating to:', link);
      // Example: navigation.navigate('ForumThreadDetail', { threadId: link.split('/').pop() });
    }
    // Refresh notifications
    const fetchedNotifications = await notificationService.fetchNotifications();
    setNotifications(fetchedNotifications);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressNotification(item._id, item.link)}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray', backgroundColor: item.read ? '#f0f0f0' : '#ffffff' }}>
              <Text style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.message}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationListScreen;
