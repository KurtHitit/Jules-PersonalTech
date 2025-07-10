// mobile/src/screens/ServiceHistoryScreen.tsx
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
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as serviceHistoryService from "@/services/serviceHistoryService";

type ServiceHistoryScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "ServiceHistory"
>;
type ServiceHistoryScreenRouteProp = RouteProp<
  MainAppStackParamList,
  "ServiceHistory"
>;

interface Props {
  navigation: ServiceHistoryScreenNavigationProp;
  route: ServiceHistoryScreenRouteProp;
}

const ServiceHistoryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { itemId } = route.params; // Get itemId from route params
  const [historyEntries, setHistoryEntries] = useState<
    serviceHistoryService.ServiceHistoryEntry[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!itemId) {
        setError("Item ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const fetchedEntries = await serviceHistoryService.fetchServiceHistory(
          itemId
        );
        setHistoryEntries(fetchedEntries);
      } catch (e) {
        setError("Failed to fetch service history.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchHistory();
    });

    return unsubscribe; // Cleanup the listener
  }, [itemId, navigation]);

  const renderEntry = ({
    item,
  }: {
    item: serviceHistoryService.ServiceHistoryEntry;
  }) => {
    const formattedDate = item.dateOfService
      ? new Date(item.dateOfService).toLocaleDateString()
      : "N/A";

    return (
      <TouchableOpacity
        testID={`service-entry-${item.serviceType.replace(/\s/g, '')}`}
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        onPress={() =>
          navigation.navigate("AddServiceEntry", {
            itemId: itemId,
            entryId: item._id,
          })
        }
      >
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {item.serviceType}
        </Text>
        {item.providerDetails && (
          <Text className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
            Provider: {item.providerDetails}
          </Text>
        )}
        <Text className="text-sm text-neutral-600 dark:text-neutral-400">
          Date: {formattedDate}
        </Text>
        {item.cost !== undefined && item.cost !== null && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Cost: ${item.cost.toFixed(2)}
          </Text>
        )}
        {item.notes && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Notes: {item.notes}
          </Text>
        )}
        {item.documents && item.documents.length > 0 && (
          <Text className="text-xs text-neutral-500 dark:text-neutral-500">
            {item.documents.length} document(s)
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
          Loading service history...
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
            Service History
          </Text>
          <TouchableOpacity
            testID="add-service-entry-button"
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg"
            onPress={() =>
              navigation.navigate("AddServiceEntry", { itemId: itemId })
            }
          >
            <Text className="text-white font-semibold">Add Entry</Text>
          </TouchableOpacity>
        </View>

        {historyEntries.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No service history found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Click "Add Entry" to add a new service record.
            </Text>
          </View>
        ) : (
          <FlatList
            data={historyEntries}
            renderItem={renderEntry}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ServiceHistoryScreen;
