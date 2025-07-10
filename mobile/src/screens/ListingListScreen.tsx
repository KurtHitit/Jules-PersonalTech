// mobile/src/screens/ListingListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '@/navigation/types';
import * as listingService from '@/services/listingService';

type ListingListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ListingList'>;

interface Props {
  navigation: ListingListScreenNavigationProp;
}

const ListingListScreen: React.FC<Props> = ({ navigation }) => {
  const [listings, setListings] = useState<listingService.Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedListings = await listingService.getListings();
        setListings(fetchedListings);
      } catch (e: any) {
        setError(e.message || "Failed to fetch listings.");
        console.error("Failed to fetch listings:", e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchListings();
    });

    return unsubscribe;
  }, [navigation]);

  const renderListing = ({ item }: { item: listingService.Listing }) => {
    return (
      <TouchableOpacity
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        onPress={() => navigation.navigate('ListingDetail', { listingId: item._id })}
      >
        {item.photos && item.photos.length > 0 && (
          <Image
            source={{ uri: `http://localhost:3000${item.photos[0].url}` }}
            className="w-full h-48 rounded-lg mb-2"
            resizeMode="cover"
          />
        )}
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          {item.item}
        </Text>
        <Text className="text-lg text-green-600 dark:text-green-400 mb-1">
          {item.currency} {item.price.toFixed(2)}
        </Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-300">
          Condition: {item.condition}
        </Text>
        <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Listed by {item.seller.firstName} {item.seller.lastName} on {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading listings...
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
          Marketplace Listings
        </Text>
        {listings.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No listings found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Be the first to list an item!
            </Text>
          </View>
        ) : (
          <FlatList
            data={listings}
            renderItem={renderListing}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListingListScreen;
