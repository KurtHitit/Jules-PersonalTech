// mobile/src/screens/AddItemScreen.tsx
import React, { useState, useEffect } from "react";
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
import { RootStackParamList } from "@/navigation/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from "react-native-image-picker";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";

import { useDispatch } from 'react-redux';
import { addItem as addItemAction, updateItem as updateItemAction } from '../store/itemSlice';
import { IItemPhoto, IItemDocument } from "@/../../backend/src/models/Item";
import * as itemMobileService from "@/services/itemService";

type AddItemScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddItem"
>;

type AddItemScreenRouteProp = RouteProp<RootStackParamList, "AddItem">;

interface Props {
  navigation: AddItemScreenNavigationProp;
  route: AddItemScreenRouteProp;
}

// Extend photo/document types to include local file info and upload status
type Uploadable<T> = T & {
  localFile?: Asset | DocumentPickerResponse;
  isUploading?: boolean;
  uploadProgress?: number;
};

interface ItemFormData {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate?: Date;
  purchasePrice: string; // Use string for input, convert to number on submit
  currency: string;
  retailer: string;
  notes: string;
  warrantyExpirationDate?: Date; // Added warrantyExpirationDate
  photos: Array<Partial<Uploadable<IItemPhoto>>>;
  documents: Array<Partial<Uploadable<IItemDocument>>>;
}

const AddItemScreen: React.FC<Props> = ({ navigation, route }) => {
  const itemId = route.params?.itemId; // Get itemId from navigation params
  const [isEditMode, setIsEditMode] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (itemId) {
      setIsEditMode(true);
      const fetchItem = async () => {
        try {
          const fetchedItem = await itemMobileService.getItemById(itemId);
          if (fetchedItem) {
            setFormData({
              name: fetchedItem.name,
              category: fetchedItem.category || "",
              brand: fetchedItem.brand || "",
              model: fetchedItem.model || "",
              serialNumber: fetchedItem.serialNumber || "",
              purchaseDate: fetchedItem.purchaseDate ? new Date(fetchedItem.purchaseDate) : undefined,
              purchasePrice: fetchedItem.purchasePrice?.toString() || "",
              currency: fetchedItem.currency || "USD",
              retailer: fetchedItem.retailer || "",
              notes: fetchedItem.notes || "",
              warrantyExpirationDate: fetchedItem.warrantyExpirationDate ? new Date(fetchedItem.warrantyExpirationDate) : undefined,
              photos: fetchedItem.photos || [],
              documents: fetchedItem.documents || [],
            });
          } else {
            Alert.alert("Error", "Item not found.");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Failed to fetch item for editing:", error);
          Alert.alert("Error", "Failed to load item for editing.");
          navigation.goBack();
        }
      };
      fetchItem();
    }
  }, [itemId, navigation, dispatch]);
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchasePrice: "",
    currency: "USD",
    retailer: "",
    notes: "",
    warrantyExpirationDate: undefined, // Initialize warrantyExpirationDate
    photos: [],
    documents: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false); // Renamed for clarity
  const [showWarrantyDatePicker, setShowWarrantyDatePicker] = useState(false); // New state for warranty date picker

  const handleInputChange = (
    name: keyof ItemFormData,
    value: string | Date
  ) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListInputChange = (
    listName: "photos" | "documents",
    index: number,
    fieldName: keyof IItemPhoto | keyof IItemDocument,
    value: string
  ) => {
    setFormData((prev) => {
      const newList = [...prev[listName]];
      // @ts-ignore
      newList[index] = { ...newList[index], [fieldName]: value };
      return { ...prev, [listName]: newList };
    });
  };

  const removeListItem = (listName: "photos" | "documents", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };

  const updateUploadStatus = (
    listName: "photos" | "documents",
    index: number,
    updates: Partial<Uploadable<IItemPhoto> | Uploadable<IItemDocument>>
  ) => {
    setFormData((prev) => {
      const newList = [...prev[listName]];
      newList[index] = { ...newList[index], ...updates };
      return { ...prev, [listName]: newList };
    });
  };

  const handleChoosePhoto = () => {
    launchImageLibrary(
      { mediaType: "photo" },
      async (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.errorCode) {
          Alert.alert(
            "ImagePicker Error",
            response.errorMessage || "An error occurred."
          );
        } else if (response.assets && response.assets[0]) {
          const file = response.assets[0];
          const newPhotoIndex = formData.photos.length;

          // Add a placeholder to the UI immediately
          setFormData((prev) => ({
            ...prev,
            photos: [
              ...prev.photos,
              { localFile: file, isUploading: true, uploadProgress: 0 },
            ],
          }));

          try {
            const uploadedFile = await itemMobileService.uploadFile(
              file,
              (progress) => {
                updateUploadStatus("photos", newPhotoIndex, {
                  uploadProgress: progress,
                });
              }
            );

            // Update the placeholder with the final URL
            updateUploadStatus("photos", newPhotoIndex, {
              url: uploadedFile.file, // The backend returns { file: '/uploads/filename.jpg' }
              isUploading: false,
              uploadProgress: 100,
            });
          } catch (error) {
            console.error("Upload failed:", error);
            Alert.alert(
              "Upload Failed",
              "Could not upload the photo. Please try again."
            );
            // Remove the failed placeholder
            removeListItem("photos", newPhotoIndex);
          }
        }
      }
    );
  };

  const handleChooseDocument = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      const newDocIndex = formData.documents.length;

      setFormData((prev) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            localFile: doc,
            isUploading: true,
            uploadProgress: 0,
            filename: doc.name || "Unnamed File",
          },
        ],
      }));

      try {
        const uploadedFile = await itemMobileService.uploadFile(
          doc,
          (progress) => {
            updateUploadStatus("documents", newDocIndex, {
              uploadProgress: progress,
            });
          }
        );

        updateUploadStatus("documents", newDocIndex, {
          url: uploadedFile.file,
          isUploading: false,
          uploadProgress: 100,
          filename: doc.name || uploadedFile.file.split("/").pop(),
        });
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert(
          "Upload Failed",
          "Could not upload the document. Please try again."
        );
        removeListItem("documents", newDocIndex);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Item name is required.");
      return;
    }
    const purchasePriceNumber = parseFloat(formData.purchasePrice);
    if (formData.purchasePrice.trim() !== "" && isNaN(purchasePriceNumber)) {
      Alert.alert("Validation Error", "Purchase price must be a valid number.");
      return;
    }

    setIsSubmitting(true);

    const submissionData: itemMobileService.NewItemData = {
      name: formData.name,
      category: formData.category || undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      serialNumber: formData.serialNumber || undefined,
      purchaseDate: formData.purchaseDate,
      purchasePrice:
        formData.purchasePrice.trim() === "" ? undefined : purchasePriceNumber,
      currency: formData.currency || undefined,
      retailer: formData.retailer || undefined,
      notes: formData.notes || undefined,
      warrantyExpirationDate: formData.warrantyExpirationDate, // Include warrantyExpirationDate
      photos: formData.photos
        .filter((p) => p.url)
        .map((p) => ({
          url: p.url!,
          caption: p.caption,
          isPrimary: p.isPrimary,
        })),
      documents: formData.documents
        .filter((d) => d.url)
        .map((d) => ({ url: d.url!, filename: d.filename!, type: d.type! })),
    };

    try {
      if (isEditMode && itemId) {
        const resultAction = await dispatch(updateItemAction({ itemId, updates: submissionData }));
        if (updateItemAction.fulfilled.match(resultAction)) {
          Alert.alert("Success", `Item "${resultAction.payload.name}" updated successfully!`);
          navigation.goBack();
        } else if (updateItemAction.rejected.match(resultAction)) {
          throw resultAction.error;
        }
      } else {
        const resultAction = await dispatch(addItemAction(submissionData));
        if (addItemAction.fulfilled.match(resultAction)) {
          Alert.alert("Success", `Item "${resultAction.payload.name}" added successfully!`);
          navigation.replace("Success");
        } else if (addItemAction.rejected.match(resultAction)) {
          throw resultAction.error;
        }
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} item:`, error);
      Alert.alert(
        "Error",
        `Failed to ${isEditMode ? 'update' : 'add'} item: ${error.message || "Please try again."}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-1 w-full";
  const subSectionClass =
    "my-3 p-3 border border-dashed border-neutral-400 dark:border-neutral-500 rounded-md";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            {isEditMode ? "Edit Item" : "Add New Item"}
          </Text>

          {/* Form fields remain the same */}
          <View>
            <Text className={labelClass}>Item Name*</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., My Awesome Laptop"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />

            <Text className={labelClass}>Category</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Electronics, Furniture"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.category}
              onChangeText={(value) => handleInputChange("category", value)}
            />

            <Text className={labelClass}>Brand</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Apple, Sony"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.brand}
              onChangeText={(value) => handleInputChange("brand", value)}
            />

            <Text className={labelClass}>Model</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., MacBook Pro 16, WH-1000XM4"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.model}
              onChangeText={(value) => handleInputChange("model", value)}
            />

            <Text className={labelClass}>Serial Number</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., C02XXXXXX"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.serialNumber}
              onChangeText={(value) => handleInputChange("serialNumber", value)}
            />

            {/* Purchase Date */}
            <Text className={labelClass}>Purchase Date</Text>
            <TouchableOpacity
              onPress={() => setShowPurchaseDatePicker(true)}
              className="mb-4"
            >
              <TextInput
                className={inputClass}
                editable={false}
                value={
                  formData.purchaseDate
                    ? formData.purchaseDate.toLocaleDateString()
                    : "Select a date"
                }
                placeholder="Select a date"
                placeholderTextColor={
                  Platform.OS === "android" ? "#999" : undefined
                }
              />
            </TouchableOpacity>
            {showPurchaseDatePicker && (
              <DateTimePicker
                value={formData.purchaseDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowPurchaseDatePicker(Platform.OS === "ios");
                  if (selectedDate)
                    handleInputChange("purchaseDate", selectedDate);
                }}
              />
            )}

            {/* Warranty Expiration Date */}
            <Text className={labelClass}>Warranty Expiration Date</Text>
            <TouchableOpacity
              onPress={() => setShowWarrantyDatePicker(true)}
              className="mb-4"
            >
              <TextInput
                className={inputClass}
                editable={false}
                value={
                  formData.warrantyExpirationDate
                    ? formData.warrantyExpirationDate.toLocaleDateString()
                    : "Select a date"
                }
                placeholder="Select a date"
                placeholderTextColor={
                  Platform.OS === "android" ? "#999" : undefined
                }
              />
            </TouchableOpacity>
            {showWarrantyDatePicker && (
              <DateTimePicker
                value={formData.warrantyExpirationDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowWarrantyDatePicker(Platform.OS === "ios");
                  if (selectedDate)
                    handleInputChange("warrantyExpirationDate", selectedDate);
                }}
              />
            )}

            {/* Purchase Price */}
            <Text className={labelClass}>Purchase Price</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., 1299.99"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.purchasePrice}
              onChangeText={(value) =>
                handleInputChange("purchasePrice", value)
              }
              keyboardType="numeric"
            />

            {/* Currency */}
            <Text className={labelClass}>Currency</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., USD, EUR"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.currency}
              onChangeText={(value) => handleInputChange("currency", value)}
              autoCapitalize="characters"
            />

            {/* Retailer */}
            <Text className={labelClass}>Retailer</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Apple Store, Amazon"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.retailer}
              onChangeText={(value) => handleInputChange("retailer", value)}
            />

            {/* Notes */}
            <Text className={labelClass}>Notes</Text>
            <TextInput
              className={`${inputClass} h-24`}
              placeholder="Any additional notes about the item..."
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              textAlignVertical="top" // For Android
            />
          </View>

          {/* Photos Section */}
          <View className={subSectionClass}>
            <Text className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Photos
            </Text>
            {formData.photos.map((photo, index) => (
              <View
                key={`photo-${index}`}
                className="mb-3 p-2 border border-neutral-200 dark:border-neutral-700 rounded"
              >
                {photo.isUploading && <ActivityIndicator className="mb-2" />}
                {photo.localFile?.uri && !photo.url && (
                  <Image
                    source={{ uri: photo.localFile.uri }}
                    className="w-24 h-24 rounded-md mb-2"
                  />
                )}
                {photo.url && (
                  <Image
                    source={{ uri: `http://localhost:3000${photo.url}` }}
                    className="w-24 h-24 rounded-md mb-2"
                  />
                )}
                <TextInput
                  className={inputClass}
                  placeholder="Caption (optional)"
                  value={photo.caption || ""}
                  onChangeText={(value) =>
                    handleListInputChange("photos", index, "caption", value)
                  }
                  editable={!photo.isUploading}
                />
                <TouchableOpacity
                  onPress={() => removeListItem("photos", index)}
                  className="bg-red-500 p-2 rounded self-end mt-1"
                >
                  <Text className="text-white text-xs">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={handleChoosePhoto}
              className="bg-blue-500 p-3 rounded-lg self-start"
            >
              <Text className="text-white font-semibold">Choose Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Documents Section */}
          <View className={subSectionClass}>
            <Text className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
              Documents
            </Text>
            {formData.documents.map((doc, index) => (
              <View
                key={`doc-${index}`}
                className="mb-3 p-2 border border-neutral-200 dark:border-neutral-700 rounded"
              >
                {doc.isUploading && <ActivityIndicator className="mb-2" />}
                <Text className="text-neutral-700 dark:text-neutral-300 mb-1">
                  {doc.filename || doc.localFile?.name}
                </Text>
                <TextInput
                  className={inputClass}
                  placeholder="Document Type (e.g., receipt)"
                  value={doc.type || "other"}
                  onChangeText={(value) =>
                    handleListInputChange(
                      "documents",
                      index,
                      "type",
                      value as IItemDocument["type"]
                    )
                  }
                  editable={!doc.isUploading}
                />
                <TouchableOpacity
                  onPress={() => removeListItem("documents", index)}
                  className="bg-red-500 p-2 rounded self-end mt-1"
                >
                  <Text className="text-white text-xs">Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={handleChooseDocument}
              className="bg-blue-500 p-3 rounded-lg self-start"
            >
              <Text className="text-white font-semibold">Choose Document</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={
              isSubmitting ||
              formData.photos.some((p) => p.isUploading) ||
              formData.documents.some((d) => d.isUploading)
            }
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isSubmitting ? "Saving..." : (isEditMode ? "Save Changes" : "Save Item")}
            </Text>
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

export default AddItemScreen;
