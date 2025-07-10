// mobile/src/screens/TechnicianListScreen.tsx
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
import * as technicianService from "@/services/technicianService";

type TechnicianListScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "TechnicianList"
>;

interface Props {
  navigation: TechnicianListScreenNavigationProp;
}

const TechnicianListScreen: React.FC<Props> = ({ navigation }) => {
  const [technicians, setTechnicians] = useState<
    technicianService.Technician[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTechnicians = await technicianService.fetchTechnicians();
        setTechnicians(fetchedTechnicians);
      } catch (e) {
        setError("Failed to fetch technicians.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchTechnicians();
    });

    return unsubscribe; // Cleanup the listener
  }, [navigation]);

  const renderTechnician = ({
    item,
  }: {
    item: technicianService.Technician;
  }) => {
    return (
      <TouchableOpacity
        testID={`technician-item-${item.name.replace(/\s/g, '')}`}
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        onPress={() =>
          navigation.navigate("TechnicianDetail", { technicianId: item._id })
        }
      >
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {item.name}
        </Text>
        {item.businessName && (
          <Text className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">
            {item.businessName}
          </Text>
        )}
        {item.servicesOffered && item.servicesOffered.length > 0 && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Services: {item.servicesOffered.join(", ")}
          </Text>
        )}
        {item.rating !== undefined && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Rating: {item.rating.toFixed(1)} ({item.reviewCount || 0} reviews)
          </Text>
        )}
        {item.address?.zipCode && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Location: {item.address.zipCode}
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
          Loading technicians...
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
            Technicians
          </Text>
          {/* Add search/filter/map view buttons here later */}
        </View>

        {technicians.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No technicians found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Check back later or adjust filters.
            </Text>
          </View>
        ) : (
          <FlatList
            data={technicians}
            renderItem={renderTechnician}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default TechnicianListScreen;
