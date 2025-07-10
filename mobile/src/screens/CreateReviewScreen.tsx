// mobile/src/screens/CreateReviewScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as reviewService from '../services/reviewService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '../navigation/types';

type CreateReviewScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'CreateReview'>;
type CreateReviewScreenRouteProp = RouteProp<MainAppStackParamList, 'CreateReview'>;

interface Props {
  navigation: CreateReviewScreenNavigationProp;
  route: CreateReviewScreenRouteProp;
}

const CreateReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { technicianId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Validation Error', 'Please provide a rating.');
      return;
    }
    setLoading(true);
    try {
      await reviewService.createReview(technicianId, rating, comment);
      Alert.alert('Success', 'Review submitted successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Submit Review</Text>
        <Text style={{ marginTop: 20 }}>Rating:</Text>
        <TextInput
          value={rating.toString()}
          onChangeText={(text) => setRating(parseInt(text) || 0)}
          keyboardType="numeric"
          maxLength={1}
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginVertical: 10 }}
        />
        <Text>Comment:</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          multiline
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginBottom: 10, height: 100 }}
        />
        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={{ color: 'white' }}>Submit Review</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateReviewScreen;
