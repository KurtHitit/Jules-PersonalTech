// mobile/src/screens/ListingDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '@/navigation/types';
import * as listingService from '@/services/listingService';
import * as paymentService from '@/services/paymentService';

type ListingDetailScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ListingDetail'>;
type ListingDetailScreenRouteProp = RouteProp<MainAppStackParamList, 'ListingDetail'>;

interface Props {
  navigation: ListingDetailScreenNavigationProp;
  route: ListingDetailScreenRouteProp;
}

const ListingDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { listingId } = route.params;
  const [listing, setListing] = useState<listingService.Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedListing = await listingService.getListingById(listingId);
        if (fetchedListing) {
          setListing(fetchedListing);
        } else {
          Alert.alert("Error", "Listing not found.");
          navigation.goBack();
        }
      } catch (e: any) {
        setError(e.message || "Failed to load listing details.");
        console.error("Failed to fetch listing:", e);
        Alert.alert("Error", "Failed to load listing details.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, navigation]);

  const handleBuyNow = async () => {
    setIsBuying(true);
    try {
      // In a real app, you'd integrate with a payment SDK (e.g., Stripe React Native SDK)
      // For now, we'll simulate the payment intent creation and confirmation.
      const { clientSecret, orderId } = await paymentService.createPaymentIntent(listingId);
      Alert.alert("Payment Initiated", `Order ${orderId} created. Client Secret: ${clientSecret}`);

      // Simulate payment confirmation (in a real app, this would be handled by Stripe SDK after user enters card details)
      // const confirmedOrder = await paymentService.confirmPayment(paymentIntentId);
      // Alert.alert("Success", "Payment successful!");

      // For now, just mark as successful after intent creation
      Alert.alert("Success", "Payment intent created. Proceed with payment on your end.");

    } catch (error: any) {
      console.error("Buy Now failed:", error);
      Alert.alert("Error", error.message || "Failed to process purchase. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading listing details...
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

  if (!listing) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500 text-lg">Listing not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {listing.item}
          </Text>

          {listing.photos && listing.photos.length > 0 && (
            <ScrollView horizontal className="mb-4">
              {listing.photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{ uri: `http://localhost:3000${photo.url}` }}
                  className="w-48 h-48 mr-2 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}

          <Text className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            {listing.currency} {listing.price.toFixed(2)}
          </Text>

          <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
            Condition: <Text className="font-semibold">{listing.condition}</Text>
          </Text>

          {listing.description && (
            <Text className="text-base text-neutral-700 dark:text-neutral-300 mb-4">
              {listing.description}
            </Text>
          )}

          <Text className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
            Listed by: {listing.seller.firstName} {listing.seller.lastName}
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Listed on: {new Date(listing.createdAt).toLocaleDateString()}
          </Text>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${isBuying ? "bg-blue-300" : "bg-blue-500"}`}
            onPress={handleBuyNow}
            disabled={isBuying}
          >
            {isBuying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Buy Now
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 py-3 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700"
            onPress={() => navigation.goBack()}
            disabled={isBuying}
          >
            <Text className="text-neutral-800 dark:text-neutral-200 text-center font-semibold text-lg">
              Back to Listings
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingDetailScreen;
