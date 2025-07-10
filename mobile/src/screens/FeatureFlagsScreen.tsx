// mobile/src/screens/FeatureFlagsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Switch, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as featureFlagService from '../services/featureFlagService';

interface FeatureFlag {
  _id: string;
  name: string;
  isEnabled: boolean;
  description?: string;
}

const FeatureFlagsScreen: React.FC = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedFlags = await featureFlagService.getAllFeatureFlags();
        setFlags(fetchedFlags);
      } catch (e: any) {
        setError(e.message || "Failed to fetch feature flags.");
        console.error("Failed to fetch feature flags:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFlags();
  }, []);

  const handleToggle = async (flagName: string, currentValue: boolean) => {
    try {
      await featureFlagService.setFeatureFlag(flagName, !currentValue);
      setFlags(prevFlags =>
        prevFlags.map(flag =>
          flag.name === flagName ? { ...flag, isEnabled: !currentValue } : flag
        )
      );
      Alert.alert("Success", `Feature '${flagName}' toggled.`);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to toggle feature flag.");
    }
  };

  const renderFlag = ({ item }: { item: FeatureFlag }) => (
    <View className="flex-row justify-between items-center p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm">
      <View className="flex-1 mr-4">
        <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{item.name}</Text>
        {item.description && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</Text>
        )}
      </View>
      <Switch
        value={item.isEnabled}
        onValueChange={() => handleToggle(item.name, item.isEnabled)}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading feature flags...
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
        <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Feature Flags
        </Text>
        {flags.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No feature flags found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={flags}
            renderItem={renderFlag}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FeatureFlagsScreen;
