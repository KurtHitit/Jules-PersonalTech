// mobile/src/screens/AddReminderScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as reminderService from "@/services/reminderService";

type AddReminderScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "AddReminder"
>;
type AddReminderScreenRouteProp = RouteProp<
  MainAppStackParamList,
  "AddReminder"
>;

interface Props {
  navigation: AddReminderScreenNavigationProp;
  route: AddReminderScreenRouteProp;
}

const AddReminderScreen: React.FC<Props> = ({ navigation, route }) => {
  const reminderId = route.params?.reminderId; // Check if we are editing an existing reminder

  const [formData, setFormData] = useState<reminderService.CreateReminderData>({
    title: "",
    notes: "",
    dueDate: new Date().toISOString(), // Default to today
    isRecurring: false,
    recurrencePattern: "none",
    itemId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (reminderId) {
      setIsEditMode(true);
      const fetchReminder = async () => {
        try {
          const fetchedReminder = await reminderService.getReminderById(
            reminderId
          );
          if (fetchedReminder) {
            setFormData({
              title: fetchedReminder.title,
              notes: fetchedReminder.notes || "",
              dueDate: fetchedReminder.dueDate.toISOString(),
              isRecurring: fetchedReminder.isRecurring,
              recurrencePattern: fetchedReminder.recurrencePattern || "none",
              itemId: fetchedReminder.itemId || "",
            });
          } else {
            Alert.alert("Error", "Reminder not found.");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Failed to fetch reminder:", error);
          Alert.alert("Error", "Failed to load reminder.");
          navigation.goBack();
        }
      };
      fetchReminder();
    }
  }, [reminderId, navigation]);

  const handleInputChange = (name: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formData.dueDate);
    setShowDatePicker(Platform.OS === "ios");
    handleInputChange("dueDate", currentDate.toISOString());
  };

  const handleRecurrenceToggle = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isRecurring: value,
      recurrencePattern: value
        ? prev.recurrencePattern === "none"
          ? "daily"
          : prev.recurrencePattern
        : "none",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Reminder title is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await reminderService.updateReminder(reminderId!, formData);
        Alert.alert("Success", "Reminder updated successfully!");
      } else {
        await reminderService.createReminder(formData);
        Alert.alert("Success", "Reminder created successfully!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save reminder:", error);
      Alert.alert(
        "Error",
        `Failed to save reminder: ${error.message || "Please try again."}`
      );
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
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            {isEditMode ? "Edit Reminder" : "Add New Reminder"}
          </Text>

          <View>
            <Text className={labelClass}>Title*</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Pay electricity bill"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />

            <Text className={labelClass}>Notes</Text>
            <TextInput
              className={`${inputClass} h-24`}
              placeholder="Any additional notes..."
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              textAlignVertical="top"
            />

            <Text className={labelClass}>Due Date*</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="mb-4"
            >
              <TextInput
                className={inputClass}
                editable={false}
                value={new Date(formData.dueDate).toLocaleDateString()}
                placeholder="Select a date"
                placeholderTextColor={
                  Platform.OS === "android" ? "#999" : undefined
                }
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.dueDate)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <View className="flex-row items-center justify-between mb-4">
              <Text className={labelClass}>Recurring Reminder</Text>
              <Switch
                onValueChange={handleRecurrenceToggle}
                value={formData.isRecurring}
              />
            </View>

            {formData.isRecurring && (
              <View className="mb-4">
                <Text className={labelClass}>Recurrence Pattern</Text>
                {/* Simple dropdown/picker for recurrencePattern can be added here */}
                <TextInput
                  className={inputClass}
                  placeholder="e.g., daily, weekly, monthly, yearly"
                  placeholderTextColor={
                    Platform.OS === "android" ? "#999" : undefined
                  }
                  value={formData.recurrencePattern}
                  onChangeText={(value) =>
                    handleInputChange("recurrencePattern", value as any)
                  }
                />
              </View>
            )}

            <Text className={labelClass}>Associated Item ID (Optional)</Text>
            <TextInput
              className={inputClass}
              placeholder="Enter Item ID if applicable"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.itemId}
              onChangeText={(value) => handleInputChange("itemId", value)}
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Reminder"}
            </Text>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddReminderScreen;
