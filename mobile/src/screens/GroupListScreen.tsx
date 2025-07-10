// mobile/src/screens/GroupListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import * as groupService from '../services/groupService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '../navigation/types';

type GroupListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'GroupList'>;

interface Props {
  navigation: GroupListScreenNavigationProp;
}

const GroupListScreen: React.FC<Props> = ({ navigation }) => {
  const [groups, setGroups] = useState<groupService.Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    const results = await groupService.searchGroups(searchQuery);
    setGroups(results);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Search for groups..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginBottom: 10 }}
        />
        <TouchableOpacity onPress={handleSearch} style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }}>
          <Text style={{ color: 'white' }}>Search</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('GroupDetail', { groupId: item._id })}>
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GroupListScreen;
