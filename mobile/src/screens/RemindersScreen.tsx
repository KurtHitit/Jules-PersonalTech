// mobile/src/screens/RemindersScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainAppStackParamList } from "@/navigation/types";
import * as reminderService from "@/services/reminderService";

type RemindersScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "Reminders"
>;

interface Props {
  navigation: RemindersScreenNavigationProp;
}

const RemindersScreen: React.FC<Props> = ({ navigation }) => {
  const [reminders, setReminders] = useState<reminderService.Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedReminders = await reminderService.fetchReminders();
        setReminders(fetchedReminders);
      } catch (e) {
        setError("Failed to fetch reminders.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    // Fetch reminders when the screen focuses
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReminders();
    });

    return unsubscribe; // Cleanup the listener
  }, [navigation]);

  const renderReminder = ({ item }: { item: reminderService.Reminder }) => {
    const formattedDueDate = item.dueDate
      ? new Date(item.dueDate).toLocaleDateString()
      : "N/A";

    return (
      <TouchableOpacity
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        onPress={() =>
          navigation.navigate("AddReminder", { reminderId: item._id })
        }
      >
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {item.title}
        </Text>
        {item.notes && (
          <Text className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
            {item.notes}
          </Text>
        )}
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          Due: {formattedDueDate}
        </Text>
        {item.isRecurring && (
          <Text className="text-xs text-neutral-500 dark:text-neutral-500">
            Recurring: {item.recurrencePattern}
          </Text>
        )}
        {item.itemId && (
          <Text className="text-xs text-neutral-500 dark:text-neutral-500">
            Item ID: {item.itemId} {/* In a real app, you'd fetch item name */}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading reminders...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-red-500 text-lg">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            My Reminders
          </Text>
          <TouchableOpacity
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg"
            onPress={() => navigation.navigate("AddReminder")}
          >
            <Text className="text-white font-semibold">Add Reminder</Text>
          </TouchableOpacity>
        </View>

        {reminders.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No reminders found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Click "Add Reminder" to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminder}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default RemindersScreen;
