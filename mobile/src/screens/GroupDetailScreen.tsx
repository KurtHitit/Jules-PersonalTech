// mobile/src/screens/GroupDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as groupService from '../services/groupService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';

type GroupDetailScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'GroupDetail'>;
type GroupDetailScreenRouteProp = RouteProp<MainAppStackParamList, 'GroupDetail'>;

interface Props {
  navigation: GroupDetailScreenNavigationProp;
  route: GroupDetailScreenRouteProp;
}

const GroupDetailScreen: React.FC<Props> = ({ route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState<groupService.Group | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      const fetchedGroup = await groupService.findGroupById(groupId);
      setGroup(fetchedGroup);
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);

  const handleJoin = async () => {
    const updatedGroup = await groupService.joinGroup(groupId);
    setGroup(updatedGroup);
  };

  const handleLeave = async () => {
    const updatedGroup = await groupService.leaveGroup(groupId);
    setGroup(updatedGroup);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!group) {
    return <Text>Group not found</Text>;
  }

  const isMember = group.members.some(member => member._id === user?.id);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{group.name}</Text>
        <Text style={{ fontSize: 16, color: 'gray' }}>{group.description}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Members</Text>
        <FlatList
          data={group.members}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Text>{item.firstName} {item.lastName}</Text>}
        />
        {isMember ? (
          <TouchableOpacity onPress={handleLeave} style={{ backgroundColor: 'red', padding: 10, alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'white' }}>Leave Group</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleJoin} style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'white' }}>Join Group</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('ForumThreadList', { groupId: group._id })} style={{ backgroundColor: 'purple', padding: 10, alignItems: 'center', marginTop: 10 }}>
          <Text style={{ color: 'white' }}>View Forum</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GroupDetailScreen;
