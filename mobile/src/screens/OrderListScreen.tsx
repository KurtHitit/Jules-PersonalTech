// mobile/src/screens/OrderListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '@/navigation/types';
import * as orderService from '@/services/orderService';

type OrderListScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'OrderList'>;

interface Props {
  navigation: OrderListScreenNavigationProp;
}

const OrderListScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<orderService.Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedOrders = await orderService.getBuyerOrders();
        setOrders(fetchedOrders);
      } catch (e: any) {
        setError(e.message || "Failed to fetch orders.");
        console.error("Failed to fetch orders:", e);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });

    return unsubscribe;
  }, [navigation]);

  const renderOrder = ({ item }: { item: orderService.Order }) => {
    return (
      <TouchableOpacity
        className="p-4 mb-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm active:bg-neutral-100 dark:active:bg-neutral-700"
        onPress={() => { /* Navigate to OrderDetailScreen if implemented */ }}
      >
        <Text className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
          Order for {item.listing.item}
        </Text>
        <Text className="text-lg text-green-600 dark:text-green-400 mb-1">
          {item.currency} {item.amount.toFixed(2)}
        </Text>
        <Text className="text-sm text-neutral-700 dark:text-neutral-300">
          Status: {item.status}
        </Text>
        <Text className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Ordered on: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading orders...
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
          My Orders
        </Text>
        {orders.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-neutral-500 dark:text-neutral-400 text-lg">
              No orders found.
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-500">
              Start shopping in the marketplace!
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderListScreen;
