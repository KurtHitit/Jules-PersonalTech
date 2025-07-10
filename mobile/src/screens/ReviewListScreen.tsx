// mobile/src/screens/ReviewListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import * as reviewService from '../services/reviewService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '../navigation/types';

type ReviewListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ReviewList'>;
type ReviewListScreenRouteProp = RouteProp<MainAppStackParamList, 'ReviewList'>;

interface Props {
  navigation: ReviewListScreenNavigationProp;
  route: ReviewListScreenRouteProp;
}

const ReviewListScreen: React.FC<Props> = ({ route }) => {
  const { technicianId } = route.params;
  const [reviews, setReviews] = useState<reviewService.Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const fetchedReviews = await reviewService.getReviewsForTechnician(technicianId);
      setReviews(fetchedReviews);
      setLoading(false);
    };
    fetchReviews();
  }, [technicianId]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
            <Text style={{ fontWeight: 'bold' }}>Rating: {item.rating}/5</Text>
            <Text>{item.comment}</Text>
            <Text style={{ fontSize: 12, color: 'gray' }}>by {item.user.firstName} {item.user.lastName}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ReviewListScreen;
