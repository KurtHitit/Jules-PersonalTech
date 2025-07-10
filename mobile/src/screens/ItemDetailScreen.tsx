// mobile/src/screens/ItemDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as itemService from "@/services/itemService";
import * as serviceHistoryService from "@/services/serviceHistoryService";

type ItemDetailScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "ItemDetail"
>;
type ItemDetailScreenRouteProp = RouteProp<MainAppStackParamList, "ItemDetail">;

interface Props {
  navigation: ItemDetailScreenNavigationProp;
  route: ItemDetailScreenRouteProp;
}

const ItemDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'photos', 'documents'
  const { itemId } = route.params;
  const [item, setItem] = useState<itemService.Item | null>(null);
  const [serviceHistory, setServiceHistory] = useState<
    serviceHistoryService.ServiceHistoryEntry[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemAndHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedItem = await itemService.getItemById(itemId);
        if (fetchedItem) {
          setItem(fetchedItem);
          const fetchedHistory =
            await serviceHistoryService.fetchServiceHistory(itemId);
          setServiceHistory(fetchedHistory);
        } else {
          Alert.alert("Error", "Item not found.");
          navigation.goBack();
        }
      } catch (e: any) {
        setError(
          e.message || "Failed to load item details or service history."
        );
        console.error("Failed to fetch item or service history:", e);
        Alert.alert("Error", "Failed to load item details or service history.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndHistory();
  }, [itemId, navigation]);

  const handleTroubleshoot = () => {
    if (item?.category) {
      navigation.navigate("Diagnostic", { itemCategory: item.category });
    } else {
      Alert.alert(
        "Info",
        "No category available for this item to provide specific diagnostics."
      );
      navigation.navigate("Diagnostic", {}); // Navigate to general diagnostic if no category
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading item details...
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

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500 text-lg">Item not found.</Text>
      </SafeAreaView>
    );
  }

  const formattedPurchaseDate = item.purchaseDate
    ? new Date(item.purchaseDate).toLocaleDateString()
    : "N/A";
  const formattedWarrantyDate = item.warrantyExpirationDate
    ? new Date(item.warrantyExpirationDate).toLocaleDateString()
    : "N/A";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {item.name}
          </Text>

          {item.category && (
            <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
              Category: <Text className="font-semibold">{item.category}</Text>
            </Text>
          )}
          {item.brand && (
            <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
              Brand: <Text className="font-semibold">{item.brand}</Text>
            </Text>
          )}
          {item.model && (
            <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
              Model: <Text className="font-semibold">{item.model}</Text>
            </Text>
          )}
          {item.serialNumber && (
            <Text className="text-lg text-neutral-700 dark:text-neutral-300 mb-2">
              Serial Number:{" "}
              <Text className="font-semibold">{item.serialNumber}</Text>
            </Text>
          )}

          <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
            <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Purchase Details
            </Text>
            <Text className="text-base text-neutral-700 dark:text-neutral-300">
              Purchase Date: {formattedPurchaseDate}
            </Text>
            {item.purchasePrice !== undefined &&
              item.purchasePrice !== null && (
                <Text className="text-base text-neutral-700 dark:text-neutral-300">
                  Price: {item.currency || ""}{" "}
                  {item.purchasePrice.toLocaleString()}
                </Text>
              )}
            {item.retailer && (
              <Text className="text-base text-neutral-700 dark:text-neutral-300">
                Retailer: {item.retailer}
              </Text>
            )}
          </View>

          {item.warrantyExpirationDate && (
            <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Warranty
              </Text>
              <View className="flex-row items-center mb-1">
                <Text className="text-base text-neutral-700 dark:text-neutral-300 mr-2">
                  Expires: {formattedWarrantyDate}
                </Text>
                {item.warrantyExpirationDate && (() => {
                  const now = new Date();
                  const expirationDate = new Date(item.warrantyExpirationDate);
                  const diffTime = expirationDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  if (diffDays > 0) {
                    return (
                      <View className="bg-yellow-500 px-2 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-white">
                          {diffDays} day{diffDays !== 1 ? 's' : ''} left
                        </Text>
                      </View>
                    );
                  } else {
                    return (
                      <View className="bg-red-500 px-2 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-white">
                          Expired
                        </Text>
                      </View>
                    );
                  }
                })()}
              </View>
            </View>
          )}

          {item.notes && (
            <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Notes
              </Text>
              <Text className="text-base text-neutral-700 dark:text-neutral-300">
                {item.notes}
              </Text>
            </View>
          )}

          {/* Troubleshoot Button */}
          <TouchableOpacity
            className="bg-purple-600 py-3 px-4 rounded-lg mt-6"
            onPress={handleTroubleshoot}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Troubleshoot Item
            </Text>
          </TouchableOpacity>

          {/* View Service History Button */}
          <TouchableOpacity
            testID="view-service-history-button"
            className="bg-green-600 py-3 px-4 rounded-lg mt-4"
            onPress={() =>
              navigation.navigate("ServiceHistory", { itemId: item._id })
            }
          >
            <Text className="text-white text-center font-semibold text-lg">
              View Service History
            </Text>
          </TouchableOpacity>

          {/* Edit Item Button */}
          <TouchableOpacity
            className="bg-blue-500 py-3 px-4 rounded-lg mt-4"
            onPress={() => navigation.navigate('AddItem', { itemId: item._id })}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Edit Item
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-around border-b border-neutral-200 dark:border-neutral-700 mt-6 mb-4">
            <TouchableOpacity
              className={`py-2 px-4 ${activeTab === 'events' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('events')}
            >
              <Text className={`text-lg font-semibold ${activeTab === 'events' ? 'text-blue-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-2 px-4 ${activeTab === 'photos' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('photos')}
            >
              <Text className={`text-lg font-semibold ${activeTab === 'photos' ? 'text-blue-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Photos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-2 px-4 ${activeTab === 'documents' ? 'border-b-2 border-blue-500' : ''}`}
              onPress={() => setActiveTab('documents')}
            >
              <Text className={`text-lg font-semibold ${activeTab === 'documents' ? 'text-blue-500' : 'text-neutral-600 dark:text-neutral-400'}`}>
                Documents
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'events' && (
            <View>
              {serviceHistory.length > 0 ? (
                serviceHistory.map((entry, index) => (
                  <View
                    key={entry._id}
                    className="mb-3 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                  >
                    <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      {entry.serviceType}
                    </Text>
                    <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                      Date: {new Date(entry.dateOfService).toLocaleDateString()}
                    </Text>
                    {entry.providerDetails && (
                      <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                        Provider: {entry.providerDetails}
                      </Text>
                    )}
                    {entry.cost !== undefined && entry.cost !== null && (
                      <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                        Cost: ${entry.cost.toFixed(2)}
                      </Text>
                    )}
                    {entry.notes && (
                      <Text className="text-sm text-neutral-700 dark:text-neutral-300">
                        Notes: {entry.notes}
                      </Text>
                    )}
                    {entry.documents && entry.documents.length > 0 && (
                      <Text className="text-xs text-neutral-500 dark:text-neutral-500">
                        {entry.documents.length} document(s)
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text className="text-neutral-500 dark:text-neutral-400 text-center mt-4">
                  No service history entries.
                </Text>
              )}
            </View>
          )}

          {activeTab === 'photos' && (
            <View>
              {item.photos && item.photos.length > 0 ? (
                item.photos.map((photo, index) => (
                  <View key={index} className="mb-4">
                    {photo.url && (
                      <Image
                        source={{ uri: `http://localhost:3000${photo.url}` }}
                        className="w-full h-48 rounded-lg"
                        resizeMode="contain"
                      />
                    )}
                    {photo.caption && (
                      <Text className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {photo.caption}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text className="text-neutral-500 dark:text-neutral-400 text-center mt-4">
                  No photos available.
                </Text>
              )}
            </View>
          )}

          {activeTab === 'documents' && (
            <View>
              {item.documents && item.documents.length > 0 ? (
                item.documents.map((doc, index) => (
                  <View key={index} className="mb-2 p-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <Text className="text-base text-blue-600 dark:text-blue-400 underline">
                      {doc.filename || "Document"} ({doc.type})
                    </Text>
                    {/* Add a way to open/view the document */}
                  </View>
                ))
              ) : (
                <Text className="text-neutral-500 dark:text-neutral-400 text-center mt-4">
                  No documents available.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDetailScreen;
