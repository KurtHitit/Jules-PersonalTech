// mobile/src/screens/BadgeCabinetScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import * as badgeService from '../services/badgeService';

const BadgeCabinetScreen: React.FC = () => {
  const [allBadges, setAllBadges] = useState<badgeService.Badge[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      setLoading(true);
      const [all, user] = await Promise.all([
        badgeService.getAllBadges(),
        badgeService.getUserBadges(),
      ]);
      setAllBadges(all);
      setUserBadges(user.map(ub => ub.badge._id));
      setLoading(false);
    };
    fetchBadges();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={allBadges}
        keyExtractor={(item) => item._id}
        numColumns={3}
        renderItem={({ item }) => (
          <View style={{ flex: 1, alignItems: 'center', padding: 10, opacity: userBadges.includes(item._id) ? 1 : 0.3 }}>
            <Image source={{ uri: item.icon }} style={{ width: 80, height: 80 }} />
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{item.name}</Text>
            <Text style={{ fontSize: 12, textAlign: 'center' }}>{item.description}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default BadgeCabinetScreen;
