// mobile/src/screens/CreateListingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainAppStackParamList } from "@/navigation/types";
import { launchImageLibrary, ImagePickerResponse, Asset } from "react-native-image-picker";
import { uploadFile } from "@/services/itemService"; // Reusing existing upload service
import * as listingService from "@/services/listingService";

type CreateListingScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "CreateListing"
>;

interface Props {
  navigation: CreateListingScreenNavigationProp;
}

interface ListingFormData {
  item: string;
  description: string;
  price: string; // Use string for input, convert to number on submit
  currency: string;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'For Parts' | '';
  photos: Array<{ url?: string; caption?: string; localFile?: Asset; isUploading?: boolean; uploadProgress?: number }>;
}

const conditions = ['New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts'];

const CreateListingScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<ListingFormData>({
    item: "",
    description: "",
    price: "",
    currency: "USD",
    condition: "",
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: keyof ListingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = () => {
    launchImageLibrary({ mediaType: "photo", selectionLimit: 5 }, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        Alert.alert("ImagePicker Error", response.errorMessage || "An error occurred.");
      } else if (response.assets && response.assets.length > 0) {
        const newPhotos = response.assets.map(asset => ({ localFile: asset, isUploading: true, uploadProgress: 0 }));
        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));

        newPhotos.forEach(async (photo, indexOffset) => {
          const currentPhotoIndex = formData.photos.length + newPhotos.indexOf(photo);
          try {
            const uploadedFile = await uploadFile(photo.localFile!, (progress) => {
              setFormData(prev => {
                const updatedPhotos = [...prev.photos];
                updatedPhotos[currentPhotoIndex] = { ...updatedPhotos[currentPhotoIndex], uploadProgress: progress };
                return { ...prev, photos: updatedPhotos };
              });
            });

            setFormData(prev => {
              const updatedPhotos = [...prev.photos];
              updatedPhotos[currentPhotoIndex] = { ...updatedPhotos[currentPhotoIndex], url: uploadedFile.file, isUploading: false, uploadProgress: 100 };
              return { ...prev, photos: updatedPhotos };
            });
          } catch (error) {
            console.error("Upload failed:", error);
            Alert.alert("Upload Failed", "Could not upload photo. Please try again.");
            setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== currentPhotoIndex) }));
          }
        });
      }
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async () => {
    if (!formData.item.trim() || !formData.price.trim() || !formData.currency.trim() || !formData.condition.trim()) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Validation Error", "Please enter a valid price.");
      return;
    }
    if (formData.photos.some(p => p.isUploading)) {
      Alert.alert("Upload in Progress", "Please wait for all photos to finish uploading.");
      return;
    }

    setIsSubmitting(true);

    try {
      const listingData = {
        item: formData.item,
        description: formData.description || undefined,
        price: parsedPrice,
        currency: formData.currency,
        condition: formData.condition as 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair' | 'For Parts',
        photos: formData.photos.filter(p => p.url).map(p => ({ url: p.url!, caption: p.caption || undefined })),
      };
      await listingService.createListing(listingData);
      Alert.alert("Success", "Listing created successfully!");
      navigation.goBack();
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      Alert.alert("Error", error.message || "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Create New Listing
          </Text>

          <Text className={labelClass}>Item Name*</Text>
          <TextInput
            className={inputClass}
            placeholder="e.g., Vintage Camera, Antique Watch"
            placeholderTextColor={Platform.OS === "android" ? "#999" : undefined}
            value={formData.item}
            onChangeText={(value) => handleInputChange("item", value)}
          />

          <Text className={labelClass}>Description</Text>
          <TextInput
            className={`${inputClass} h-24`}
            placeholder="Detailed description of the item..."
            placeholderTextColor={Platform.OS === "android" ? "#999" : undefined}
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            multiline
            textAlignVertical="top"
          />

          <Text className={labelClass}>Price*</Text>
          <TextInput
            className={inputClass}
            placeholder="e.g., 150.00"
            placeholderTextColor={Platform.OS === "android" ? "#999" : undefined}
            value={formData.price}
            onChangeText={(value) => handleInputChange("price", value)}
            keyboardType="numeric"
          />

          <Text className={labelClass}>Currency*</Text>
          <TextInput
            className={inputClass}
            placeholder="e.g., USD, EUR"
            placeholderTextColor={Platform.OS === "android" ? "#999" : undefined}
            value={formData.currency}
            onChangeText={(value) => handleInputChange("currency", value)}
            autoCapitalize="characters"
          />

          <Text className={labelClass}>Condition*</Text>
          <View className="mb-4">
            {conditions.map((condition) => (
              <TouchableOpacity
                key={condition}
                className={`p-3 border rounded-lg mb-2 ${formData.condition === condition ? "bg-blue-500 border-blue-500" : "border-neutral-300 dark:border-neutral-600"}`}
                onPress={() => handleInputChange("condition", condition)}
              >
                <Text className={`${formData.condition === condition ? "text-white" : "text-neutral-900 dark:text-neutral-100"}`}>
                  {condition}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className={labelClass}>Photos</Text>
          <View className="flex-row flex-wrap mb-4">
            {formData.photos.map((photo, index) => (
              <View key={index} className="relative w-24 h-24 m-1 border border-neutral-300 rounded-md overflow-hidden">
                {photo.localFile?.uri && (
                  <Image source={{ uri: photo.localFile.uri }} className="w-full h-full" />
                )}
                {photo.url && !photo.localFile && (
                  <Image source={{ uri: `http://localhost:3000${photo.url}` }} className="w-full h-full" />
                )}
                {photo.isUploading && (
                  <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center">
                    <ActivityIndicator color="#fff" />
                    <Text className="text-white text-xs mt-1">{photo.uploadProgress}%</Text>
                  </View>
                )}
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                  onPress={() => removePhoto(index)}
                >
                  <Text className="text-white text-xs">X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              className="w-24 h-24 m-1 border border-dashed border-neutral-400 rounded-md justify-center items-center"
              onPress={handlePhotoUpload}
            >
              <Text className="text-4xl text-neutral-400">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${isSubmitting ? "bg-blue-300" : "bg-blue-500"}`}
            onPress={handleSubmit}
            disabled={isSubmitting || formData.photos.some(p => p.isUploading)}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Create Listing
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 py-3 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text className="text-neutral-800 dark:text-neutral-200 text-center font-semibold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateListingScreen;
