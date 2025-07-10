// mobile/src/screens/LeaderboardScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import * as leaderboardService from '../services/leaderboardService';

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<leaderboardService.LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const fetchedLeaderboard = await leaderboardService.getLeaderboard();
      setLeaderboard(fetchedLeaderboard);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
            <Text>{index + 1}. {item.firstName} {item.lastName}</Text>
            <Text>Level {item.level} - {item.xp} XP</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default LeaderboardScreen;
