// mobile/src/screens/ItemListScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Item } from "@/../../backend/src/models/Item"; // Adjust path as necessary if backend models are not directly accessible
// Or define a local Item type for mobile if preferred.
// For now, this direct import is for type consistency.

// Mock item service for now
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchItems as fetchItemsAction } from '../store/itemSlice';

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation/types";

type ItemListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ItemList"
>;

interface Props {
  navigation: ItemListScreenNavigationProp;
}

const ItemListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state: RootState) => state.item);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    dispatch(fetchItemsAction(searchQuery));
  }, [dispatch, searchQuery]);

  const renderItem = ({ item }: { item: Item }) => {
    const formattedPurchaseDate = item.purchaseDate
      ? new Date(item.purchaseDate).toLocaleDateString()
      : "N/A";

    return (
      <TouchableOpacity
        testID={`item-${item.name.replace(/\s/g, '')}`}
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        // onPress={() => navigation.navigate('ItemDetail', { itemId: item._id })} // Use item._id for Mongoose
        onPress={() => navigation.navigate("ItemDetail", { itemId: item._id })} // Use item._id for Mongoose
      >
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {item.name}
        </Text>

        <View className="flex-row flex-wrap mb-1">
          {item.category && (
            <Text className="text-sm text-neutral-700 dark:text-neutral-300 mr-3">
              <Text className="font-semibold">Category:</Text> {item.category}
            </Text>
          )}
          {item.brand && (
            <Text className="text-sm text-neutral-700 dark:text-neutral-300">
              <Text className="font-semibold">Brand:</Text> {item.brand}
            </Text>
          )}
        </View>

        {item.model && (
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            Model: {item.model}
          </Text>
        )}

        <View className="border-t border-neutral-200 dark:border-neutral-700 mt-2 pt-2">
          {item.purchasePrice !== undefined && item.purchasePrice !== null && (
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              Price: {item.currency || ""} {item.purchasePrice.toLocaleString()}
            </Text>
          )}
          <Text className="text-sm text-neutral-600 dark:text-neutral-400">
            Purchased: {formattedPurchaseDate}
          </Text>
          {item.retailer && (
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              From: {item.retailer}
            </Text>
          )}
        </View>
        <View className="mt-2 flex-row justify-between items-center">
          <View className="flex-row">
            {item.photos && item.photos.length > 0 && (
              <View className="flex-row items-center mr-3">
                <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                  📸 {item.photos.length}
                </Text>
              </View>
            )}
            {item.documents && item.documents.length > 0 && (
              <View className="flex-row items-center">
                <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                  📄 {item.documents.length}
                </Text>
              </View>
            )}
          </View>
          {item.warrantyExpirationDate && new Date(item.warrantyExpirationDate) > new Date() && (
            <View className="bg-yellow-500 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-white">
                Warranty Expires: {new Date(item.warrantyExpirationDate).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (status === 'loading') {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading items...
        </Text>
      </SafeAreaView>
    );
  }

  if (status === 'failed') {
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
            My Items
          </Text>
          <TouchableOpacity
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg"
            onPress={() => navigation.navigate("AddItem")} // Navigate to AddItemScreen
          >
            <Text className="text-white font-semibold">Add Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("GroupList")} // Navigate to GroupListScreen
          >
            <Text className="text-white font-semibold">Groups</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("ConversationList")} // Navigate to ConversationListScreen
          >
            <Text className="text-white font-semibold">Conversations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("BadgeCabinet")} // Navigate to BadgeCabinetScreen
          >
            <Text className="text-white font-semibold">Badges</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("Leaderboard")} // Navigate to LeaderboardScreen
          >
            <Text className="text-white font-semibold">Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 hover:bg-green-600 active:bg-green-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("ListingList")} // Navigate to ListingListScreen
          >
            <Text className="text-white font-semibold">Marketplace</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("OrderList")} // Navigate to OrderListScreen
          >
            <Text className="text-white font-semibold">My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("DisputeList")} // Navigate to DisputeListScreen
          >
            <Text className="text-white font-semibold">Disputes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("Referral")} // Navigate to ReferralScreen
          >
            <Text className="text-white font-semibold">Referral</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("NPSFeedback")} // Navigate to NPSFeedbackScreen
          >
            <Text className="text-white font-semibold">Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("Changelog")} // Navigate to ChangelogScreen
          >
            <Text className="text-white font-semibold">Changelog</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-700 hover:bg-gray-800 active:bg-gray-900 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("FeatureFlags")} // Navigate to FeatureFlagsScreen
          >
            <Text className="text-white font-semibold">Features</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("Profile")} // Navigate to ProfileScreen
          >
            <Text className="text-white font-semibold">Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("CreateListing")} // Navigate to CreateListingScreen
          >
            <Text className="text-white font-semibold">Sell Item</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 py-2 px-4 rounded-lg ml-2"
            onPress={() => navigation.navigate("NotificationList")} // Navigate to NotificationListScreen
          >
            <Text className="text-white font-semibold">Notifications</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          testID="item-search-input"
          className="border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full"
          placeholder="Search items..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No items found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Click "Add Item" to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            testID="item-list"
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item._id} // Use item._id for Mongoose documents
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ItemListScreen;
