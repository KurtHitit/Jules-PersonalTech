// mobile/src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import * as gamificationService from '../services/gamificationService';
import GoodOwnerBadge from '@/components/GoodOwnerBadge';

const ProfileScreen: React.FC = () => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      setLoading(true);
      const { score } = await gamificationService.getGoodOwnerScore();
      setScore(score);
      setLoading(false);
    };
    fetchScore();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Good Owner Score</Text>
      <Text style={{ fontSize: 48, fontWeight: 'bold' }}>{score}</Text>
      <GoodOwnerBadge score={score} />
    </SafeAreaView>
  );
};

export default ProfileScreen;
