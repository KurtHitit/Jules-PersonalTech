// mobile/src/screens/NPSFeedbackScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import * as npsService from '../services/npsService';

const NPSFeedbackScreen: React.FC = ({ navigation }) => {
  const [score, setScore] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const parsedScore = parseInt(score, 10);

    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      Alert.alert("Validation Error", "Please enter a score between 0 and 10.");
      return;
    }

    setIsSubmitting(true);
    try {
      await npsService.submitNPS(parsedScore, feedback);
      Alert.alert("Thank You!", "Your feedback has been submitted.");
      navigation.goBack();
    } catch (error: any) {
      console.error("Failed to submit NPS feedback:", error);
      Alert.alert("Error", error.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="p-4">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 text-center">
          How likely are you to recommend us?
        </Text>

        <Text className={labelClass}>Score (0-10)*</Text>
        <TextInput
          className={inputClass}
          placeholder="e.g., 9"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={2}
          value={score}
          onChangeText={setScore}
        />

        <Text className={labelClass}>Optional Feedback</Text>
        <TextInput
          className={`${inputClass} h-24`}
          placeholder="Tell us why you gave this score..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
          value={feedback}
          onChangeText={setFeedback}
        />

        <TouchableOpacity
          className={`mt-6 py-3 px-4 rounded-lg ${isSubmitting ? "bg-blue-300" : "bg-blue-500"}`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Submit Feedback
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 py-3 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text className="text-neutral-800 dark:text-neutral-200 text-center font-semibold text-lg">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NPSFeedbackScreen;
