// mobile/src/screens/TechnicianDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as technicianService from "@/services/technicianService";
import BookingModal from "@/components/BookingModal";

type TechnicianDetailScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "TechnicianDetail"
>;
type TechnicianDetailScreenRouteProp = RouteProp<
  MainAppStackParamList,
  "TechnicianDetail"
>;

interface Props {
  navigation: TechnicianDetailScreenNavigationProp;
  route: TechnicianDetailScreenRouteProp;
}

const TechnicianDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { technicianId } = route.params;
  const [technician, setTechnician] =
    useState<technicianService.Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTechnician = await technicianService.getTechnicianById(
          technicianId
        );
        if (fetchedTechnician) {
          setTechnician(fetchedTechnician);
        } else {
          Alert.alert("Error", "Technician not found.");
          navigation.goBack();
        }
      } catch (e: any) {
        setError(e.message || "Failed to load technician details.");
        console.error("Failed to fetch technician:", e);
        Alert.alert("Error", "Failed to load technician details.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchTechnician();
  }, [technicianId, navigation]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const handleBookService = () => {
    setIsBookingModalVisible(true);
  };

  const handleBookingConfirm = async (bookingDetails: {
    date: Date;
    problem: string;
    documents: { url: string; filename: string; type: string }[];
  }) => {
    // Here you would typically send the booking details to your backend
    console.log("Booking confirmed:", bookingDetails);
    Alert.alert(
      "Booking Confirmed",
      `Service booked with ${
        technician?.name
      } for ${bookingDetails.date.toLocaleDateString()}.`
    );
    setIsBookingModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-neutral-600 dark:text-neutral-400">
          Loading technician details...
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

  if (!technician) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <Text className="text-neutral-500 text-lg">Technician not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {technician.name}
          </Text>

          {technician.businessName && (
            <Text className="text-xl text-neutral-700 dark:text-neutral-300 mb-2">
              {technician.businessName}
            </Text>
          )}

          {technician.bio && (
            <Text className="text-base text-neutral-700 dark:text-neutral-300 mb-4">
              {technician.bio}
            </Text>
          )}

          <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
            <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Contact Info
            </Text>
            <Text className="text-base text-neutral-700 dark:text-neutral-300">
              Email: {technician.contactEmail}
            </Text>
            {technician.contactPhone && (
              <Text className="text-base text-neutral-700 dark:text-neutral-300">
                Phone: {technician.contactPhone}
              </Text>
            )}
            {technician.website && (
              <Text
                className="text-base text-blue-600 dark:text-blue-400 underline"
                onPress={() => handleWebsite(technician.website!)}
              >
                Website: {technician.website}
              </Text>
            )}
          </View>

          {technician.address && (
            <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Address
              </Text>
              {technician.address.street && (
                <Text className="text-base text-neutral-700 dark:text-neutral-300">
                  {technician.address.street}
                </Text>
              )}
              <Text className="text-base text-neutral-700 dark:text-neutral-300">
                {technician.address.city}, {technician.address.state}{" "}
                {technician.address.zipCode}
              </Text>
              {technician.address.country && (
                <Text className="text-base text-neutral-700 dark:text-neutral-300">
                  {technician.address.country}
                </Text>
              )}
            </View>
          )}

          <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
            <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Services Offered
            </Text>
            {technician.servicesOffered.map((service, index) => (
              <Text
                key={index}
                className="text-base text-neutral-700 dark:text-neutral-300"
              >
                • {service}
              </Text>
            ))}
          </View>

          {technician.specialties && technician.specialties.length > 0 && (
            <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Specialties
              </Text>
              {technician.specialties.map((specialty, index) => (
                <Text
                  key={index}
                  className="text-base text-neutral-700 dark:text-neutral-300"
                >
                  • {specialty}
                </Text>
              ))}
            </View>
          )}

          {technician.rating !== undefined && (
            <View className="border-t border-neutral-200 dark:border-neutral-700 mt-4 pt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Rating
              </Text>
              <Text className="text-base text-neutral-700 dark:text-neutral-300">
                {technician.rating.toFixed(1)} out of 5 stars (
                {technician.reviewCount || 0} reviews)
              </Text>
            </View>
          )}

          {/* Contact Buttons */}
          <View className="flex-row justify-around mt-6">
            {technician.contactPhone && (
              <TouchableOpacity
              testID="call-technician-button"
              className="bg-blue-500 py-3 px-4 rounded-lg flex-1 mx-2"
              onPress={() => handleCall(technician.contactPhone!)}
            >
                <Text className="text-white text-center font-semibold text-lg">
                  Call
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="bg-blue-500 py-3 px-4 rounded-lg flex-1 mx-2"
              onPress={() => handleEmail(technician.contactEmail)}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Book Service Button */}
          <TouchableOpacity
            className="bg-indigo-600 py-3 px-4 rounded-lg mt-4"
            onPress={handleBookService}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Book Service
            </Text>
          </TouchableOpacity>

          {/* Chat Button */}
          <TouchableOpacity
            className="bg-green-600 py-3 px-4 rounded-lg mt-4"
            onPress={() => navigation.navigate('Chat', { userId: technician._id, name: technician.name })}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Chat with Technician
            </Text>
          </TouchableOpacity>

          {/* View Reviews Button */}
          <TouchableOpacity
            className="bg-blue-600 py-3 px-4 rounded-lg mt-4"
            onPress={() => navigation.navigate('ReviewList', { technicianId: technician._id })}
          >
            <Text className="text-white text-center font-semibold text-lg">
              View Reviews
            </Text>
          </TouchableOpacity>

          {/* Submit Review Button */}
          <TouchableOpacity
            className="bg-yellow-600 py-3 px-4 rounded-lg mt-4"
            onPress={() => navigation.navigate('CreateReview', { technicianId: technician._id })}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Submit Review
            </Text>
          </TouchableOpacity>

          <BookingModal
            isVisible={isBookingModalVisible}
            onClose={() => setIsBookingModalVisible(false)}
            onConfirm={handleBookingConfirm}
            technicianName={technician.name}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TechnicianDetailScreen;
