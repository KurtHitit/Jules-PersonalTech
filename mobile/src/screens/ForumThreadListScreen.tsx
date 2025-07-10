// mobile/src/screens/ForumThreadListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as forumService from '../services/forumService';
import * as reportService from '../services/reportService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '../navigation/types';

type ForumThreadListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ForumThreadList'>;

interface Props {
  navigation: ForumThreadListScreenNavigationProp;
}

const ForumThreadListScreen: React.FC<Props> = ({ navigation }) => {
  const [threads, setThreads] = useState<forumService.ForumThread[]>([]);
  const [loading, setLoading] = useState(true);

  const handleReport = async (entityId: string, entityType: 'ForumThread') => {
    Alert.prompt(
      'Report Content',
      'Please provide a reason for reporting this content.',
      async (reason) => {
        if (reason) {
          try {
            await reportService.createReport(entityType, entityId, reason);
            Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
          } catch (error) {
            Alert.alert('Error', 'Failed to submit report.');
          }
        }
      }
    );
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
            <TouchableOpacity onPress={() => navigation.navigate('ForumThreadDetail', { threadId: item._id })}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>by {item.author.firstName} {item.author.lastName}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReport(item._id, 'ForumThread')} style={{ backgroundColor: 'red', padding: 5, alignItems: 'center', marginTop: 5 }}>
              <Text style={{ color: 'white', fontSize: 12 }}>Report Thread</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity 
        onPress={() => navigation.navigate('CreateForumThread')} 
        style={{ backgroundColor: 'blue', padding: 15, alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Create Thread</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForumThreadListScreen;
