// mobile/src/screens/ItemListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
// Placeholder for navigation props, replace with actual types from React Navigation
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '@/navigation/types'; // Assuming types are defined here

import { Item } from '@/../../backend/src/models/Item'; // Adjust path as necessary if backend models are not directly accessible
                                                     // Or define a local Item type for mobile if preferred.
                                                     // For now, this direct import is for type consistency.

// Mock item service for now
import * as itemMobileService from '@/services/itemService';

import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';

type ItemListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ItemList'
>;

interface Props {
  navigation: ItemListScreenNavigationProp;
}


const ItemListScreen: React.FC<Props> = ({ navigation }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedItems = await itemMobileService.fetchItems(); // Using mobile service
        setItems(fetchedItems);
      } catch (e) {
        setError('Failed to fetch items.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      className="p-4 mb-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm"
      // onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })} // For future ItemDetailScreen
      onPress={() => console.log('Navigate to item detail for:', item.name)}
    >
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</Text>
      {item.category && <Text className="text-sm text-neutral-600 dark:text-neutral-400">Category: {item.category}</Text>}
      {item.brand && <Text className="text-sm text-neutral-600 dark:text-neutral-400">Brand: {item.brand}</Text>}
      {item.model && <Text className="text-sm text-neutral-600 dark:text-neutral-400">Model: {item.model}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">Loading items...</Text>
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
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Items</Text>
          <TouchableOpacity
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg"
            onPress={() => navigation.navigate('AddItem')} // Navigate to AddItemScreen
          >
            <Text className="text-white font-semibold">Add Item</Text>
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">No items found.</Text>
            <Text className="text-neutral-400 dark:text-neutral-500">Click "Add Item" to get started!</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ItemListScreen;
