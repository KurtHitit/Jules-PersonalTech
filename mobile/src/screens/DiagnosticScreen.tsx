// mobile/src/screens/DiagnosticScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as itemService from "@/services/itemService"; // Using itemService for diagnostic API call
import CollapsibleSection from "@/components/ui/CollapsibleSection";

type DiagnosticScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "Diagnostic"
>;
type DiagnosticScreenRouteProp = RouteProp<MainAppStackParamList, "Diagnostic">;

interface Props {
  navigation: DiagnosticScreenNavigationProp;
  route: DiagnosticScreenRouteProp;
}

const DiagnosticScreen: React.FC<Props> = ({
  navigation: _navigation,
  route,
}) => {
  const { itemCategory } = route.params || {}; // Get itemCategory from route params

  const [problemDescription, setProblemDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!problemDescription.trim()) {
      Alert.alert("Validation Error", "Please describe the problem.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);
    setIsHelpful(null); // Reset feedback state on new search
    setIsFixedProblem(false);
    setFeedbackText('');

    try {
      const fetchedSuggestions = await itemService.getDiagnosticSuggestions({
        itemCategory: itemCategory || "general", // Use provided category or default to 'general'
        problemDescription,
      });
      setSuggestions(fetchedSuggestions);
    } catch (e: any) {
      setError(e.message || "Failed to get suggestions.");
      console.error("Diagnostic API call failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (isHelpful === null) {
      Alert.alert("Feedback Required", "Please indicate if the suggestions were helpful.");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await itemService.submitDiagnosticFeedback({
        query: {
          itemCategory: itemCategory || "general",
          problemDescription,
        },
        suggestions,
        isHelpful,
        fixedProblem: isFixedProblem,
        feedbackText,
      });
      Alert.alert("Thank You!", "Your feedback has been submitted.");
      // Optionally reset feedback form or hide it
      setIsHelpful(null);
      setIsFixedProblem(false);
      setFeedbackText('');
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to submit feedback.");
      console.error("Feedback submission failed:", e);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            AI Diagnostic Tool
          </Text>

          {itemCategory && (
            <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-4">
              For: <Text className="font-semibold">{itemCategory}</Text>
            </Text>
          )}

          <Text className={labelClass}>Describe the problem:</Text>
          <TextInput
            testID="problem-description-input"
            className={`${inputClass} h-32`}
            placeholder="e.g., My laptop won't turn on, Refrigerator is not cooling..."
            placeholderTextColor={
              Platform.OS === "android" ? "#999" : undefined
            }
            value={problemDescription}
            onChangeText={setProblemDescription}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`mt-4 py-3 px-4 rounded-lg ${
              loading ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={handleGetSuggestions}
            disabled={loading}
            testID="get-suggestions-button"
          >
            {loading ? (
              <ActivityIndicator testID="loading-indicator" color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Get Suggestions
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-indigo-600 py-3 px-4 rounded-lg mt-4"
            onPress={() => _navigation.navigate('TechnicianList')}
            testID="escalate-to-technician-button"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Escalate to Technician
            </Text>
          </TouchableOpacity>

          {error && (
            <View className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg">
              <Text className="text-red-700">Error: {error}</Text>
            </View>
          )}

          {suggestions.length > 0 && (
            <View className="mt-6">
              <Text className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-3">
                Suggestions:
              </Text>
              {suggestions.map((suggestion, index) => (
                <CollapsibleSection key={index} title={`Step ${index + 1}`}>
                  <Text className="text-neutral-800 dark:text-neutral-200">{suggestion}</Text>
                </CollapsibleSection>
              ))}

              {/* Feedback Section */}
              <View className="mt-6 p-4 border border-neutral-300 dark:border-neutral-700 rounded-lg">
                <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Was this helpful?</Text>
                <View className="flex-row justify-center mb-4">
                  <TouchableOpacity
                    testID="thumbs-up-button"
                    className={`p-3 rounded-full mx-2 ${isHelpful === true ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onPress={() => setIsHelpful(true)}
                  >
                    <Text className="text-2xl">👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="thumbs-down-button"
                    className={`p-3 rounded-full mx-2 ${isHelpful === false ? 'bg-red-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                    onPress={() => setIsHelpful(false)}
                  >
                    <Text className="text-2xl">👎</Text>
                  </TouchableOpacity>
                </View>

                {isHelpful !== null && (
                  <>
                    <View className="flex-row items-center mb-4">
                      <Switch
                        testID="fixed-problem-switch"
                        onValueChange={setIsFixedProblem}
                        value={isFixedProblem}
                      />
                      <Text className="ml-2 text-base text-neutral-700 dark:text-neutral-300">Did this fix your problem?</Text>
                    </View>

                    <Text className={labelClass}>Additional Feedback (Optional)</Text>
                    <TextInput
                      testID="feedback-text-input"
                      className={`${inputClass} h-24`}
                      placeholder="Tell us more..."
                      placeholderTextColor={Platform.OS === 'android' ? '#999' : undefined}
                      value={feedbackText}
                      onChangeText={setFeedbackText}
                      multiline
                      textAlignVertical="top"
                    />

                    <TouchableOpacity
                      testID="submit-feedback-button"
                      className={`mt-4 py-3 px-4 rounded-lg ${isSubmittingFeedback ? 'bg-blue-300' : 'bg-blue-500'}`}
                      onPress={handleSubmitFeedback}
                      disabled={isSubmittingFeedback}
                    >
                      {isSubmittingFeedback ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-white text-center font-semibold text-lg">Submit Feedback</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiagnosticScreen;
