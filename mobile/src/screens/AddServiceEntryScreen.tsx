// mobile/src/screens/AddServiceEntryScreen.tsx
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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { MainAppStackParamList } from "@/navigation/types";
import * as serviceHistoryService from "@/services/serviceHistoryService";
import DocumentPicker from "react-native-document-picker";

type AddServiceEntryScreenNavigationProp = StackNavigationProp<
  MainAppStackParamList,
  "AddServiceEntry"
>;
type AddServiceEntryScreenRouteProp = RouteProp<
  MainAppStackParamList,
  "AddServiceEntry"
>;

interface Props {
  navigation: AddServiceEntryScreenNavigationProp;
  route: AddServiceEntryScreenRouteProp;
}

const AddServiceEntryScreen: React.FC<Props> = ({ navigation, route }) => {
  const { itemId, entryId } = route.params; // Get itemId and optional entryId from route params

  const [formData, setFormData] =
    useState<serviceHistoryService.CreateServiceHistoryData>({
      itemId: itemId || "",
      serviceType: "",
      dateOfService: new Date().toISOString(),
      providerDetails: "",
      cost: undefined,
      notes: "",
      documents: [],
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (entryId && itemId) {
      setIsEditMode(true);
      const fetchEntry = async () => {
        try {
          const fetchedEntry =
            await serviceHistoryService.getServiceHistoryEntryById(
              itemId,
              entryId
            );
          if (fetchedEntry) {
            setFormData({
              itemId: fetchedEntry.itemId.toString(),
              serviceType: fetchedEntry.serviceType,
              dateOfService: fetchedEntry.dateOfService.toISOString(),
              providerDetails: fetchedEntry.providerDetails || "",
              cost: fetchedEntry.cost,
              notes: fetchedEntry.notes || "",
              documents: fetchedEntry.documents || [],
            });
          } else {
            Alert.alert("Error", "Service history entry not found.");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Failed to fetch service history entry:", error);
          Alert.alert("Error", "Failed to load service history entry.");
          navigation.goBack();
        }
      };
      fetchEntry();
    } else if (!itemId) {
      Alert.alert("Error", "Item ID is required to add a service entry.");
      navigation.goBack();
    }
  }, [itemId, entryId, navigation]);

  const handleInputChange = (name: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date(formData.dateOfService);
    setShowDatePicker(Platform.OS === "ios");
    handleInputChange("dateOfService", currentDate.toISOString());
  };

  const handleChooseDocument = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      // For now, we'll just add the document URL. In a real app, you'd upload it first.
      setFormData((prev) => ({
        ...prev,
        documents: [
          ...(prev.documents || []),
          { url: doc.uri, filename: doc.name || "Unnamed File", type: "other" },
        ],
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.serviceType.trim() || !formData.dateOfService) {
      Alert.alert("Validation Error", "Service type and date are required.");
      return;
    }
    if (!itemId) {
      Alert.alert("Error", "Item ID is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await serviceHistoryService.updateServiceHistoryEntry(
          itemId,
          entryId!,
          formData
        );
        Alert.alert("Success", "Service history entry updated successfully!");
      } else {
        await serviceHistoryService.createServiceHistoryEntry(formData);
        Alert.alert("Success", "Service history entry added successfully!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save service history entry:", error);
      Alert.alert(
        "Error",
        `Failed to save service history entry: ${
          error.message || "Please try again."
        }`
      );
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
            {isEditMode ? "Edit Service Entry" : "Add New Service Entry"}
          </Text>

          <View>
            <Text className={labelClass}>Service Type*</Text>
            <TextInput
              testID="service-type-input"
              className={inputClass}
              placeholder="e.g., Oil Change, Screen Repair"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.serviceType}
              onChangeText={(value) => handleInputChange("serviceType", value)}
            />

            <Text className={labelClass}>Date of Service*</Text>
            <TouchableOpacity
              testID="date-of-service-picker"
              onPress={() => setShowDatePicker(true)}
              className="mb-4"
            >
              <TextInput
                className={inputClass}
                editable={false}
                value={new Date(formData.dateOfService).toLocaleDateString()}
                placeholder="Select a date"
                placeholderTextColor={
                  Platform.OS === "android" ? "#999" : undefined
                }
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(formData.dateOfService)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            <Text className={labelClass}>Provider Details</Text>
            <TextInput
              testID="provider-details-input"
              className={inputClass}
              placeholder="e.g., John's Auto Shop, Apple Store"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.providerDetails}
              onChangeText={(value) =>
                handleInputChange("providerDetails", value)
              }
            />

            <Text className={labelClass}>Cost (Optional)</Text>
            <TextInput
              testID="cost-input"
              className={inputClass}
              placeholder="e.g., 150.00"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.cost?.toString() || ""}
              onChangeText={(value) =>
                handleInputChange("cost", parseFloat(value) || undefined)
              }
              keyboardType="numeric"
            />

            <Text className={labelClass}>Notes</Text>
            <TextInput
              testID="notes-input"
              className={`${inputClass} h-24`}
              placeholder="Any additional notes about the service..."
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={formData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              textAlignVertical="top"
            />

            <View className="mt-4">
              <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                Documents
              </Text>
              {formData.documents &&
                formData.documents.map((doc, index) => (
                  <View
                    key={index}
                    className="mb-2 p-2 border border-neutral-200 dark:border-neutral-700 rounded"
                  >
                    <Text className="text-neutral-700 dark:text-neutral-300">
                      {doc.filename}
                    </Text>
                    {/* In a real app, you'd display a link or preview */}
                  </View>
                ))}
              <TouchableOpacity
                onPress={handleChooseDocument}
                className="bg-blue-500 p-3 rounded-lg self-start"
              >
                <Text className="text-white font-semibold">Add Document</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isSubmitting
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Add Entry"}
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

export default AddServiceEntryScreen;
