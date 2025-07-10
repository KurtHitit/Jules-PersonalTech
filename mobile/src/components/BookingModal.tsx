// mobile/src/components/BookingModal.tsx
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (bookingDetails: {
    date: Date;
    problem: string;
    documents: { url: string; filename: string; type: string }[];
  }) => Promise<void>;
  technicianName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  technicianName,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [problemDescription, setProblemDescription] = useState("");
  const [documents, setDocuments] = useState<DocumentPickerResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(currentDate);
  };

  const handleDocumentPick = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });
      setDocuments((prev) => [...prev, ...res]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log("User cancelled document picker");
      } else {
        // Unknown error
        console.error("Document picker error:", err);
        Alert.alert("Error", "Failed to pick document.");
      }
    }
  };

  const handleConfirm = async () => {
    if (!problemDescription.trim()) {
      Alert.alert("Validation", "Please describe the problem.");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you'd upload documents first and get their URLs
      // For now, we'll just pass the document info as is.
      const uploadedDocuments = documents.map((doc) => ({
        url: doc.uri, // Placeholder: In real app, this would be the uploaded URL
        filename: doc.name || "unnamed_file",
        type: doc.type || "application/octet-stream",
      }));

      await onConfirm({
        date: selectedDate,
        problem: problemDescription,
        documents: uploadedDocuments,
      });
      // Reset form after successful submission
      setSelectedDate(new Date());
      setProblemDescription("");
      setDocuments([]);
      onClose();
    } catch (error) {
      console.error("Booking confirmation failed:", error);
      Alert.alert("Error", "Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white dark:bg-neutral-900 p-6 rounded-lg w-11/12 max-w-md">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 text-center">
            Book Service with {technicianName}
          </Text>

          <Text className={labelClass}>Preferred Date & Time</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="mb-4"
          >
            <TextInput
              className={inputClass}
              editable={false}
              value={selectedDate.toLocaleString()}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Text className={labelClass}>Describe the Problem*</Text>
          <TextInput
            className={`${inputClass} h-24`}
            placeholder="e.g., My AC is blowing warm air..."
            placeholderTextColor={
              Platform.OS === "android" ? "#999" : undefined
            }
            value={problemDescription}
            onChangeText={setProblemDescription}
            multiline
            textAlignVertical="top"
          />

          <Text className={labelClass}>Attach Documents (Optional)</Text>
          {documents.map((doc, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-neutral-700 dark:text-neutral-300 flex-1">
                {doc.name}
              </Text>
              {/* Add a remove button for documents if needed */}
            </View>
          ))}
          <TouchableOpacity
            onPress={handleDocumentPick}
            className="bg-gray-200 dark:bg-neutral-700 p-3 rounded-lg mb-4"
          >
            <Text className="text-neutral-800 dark:text-neutral-200 text-center font-semibold">
              Select Document(s)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`py-3 px-4 rounded-lg ${
              isSubmitting ? "bg-blue-300" : "bg-blue-500"
            } mb-3`}
            onPress={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Confirm Booking
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="cancel-booking-button"
            className="py-3 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-700"
            onPress={onClose}
            disabled={isSubmitting}
          >
            <Text className="text-neutral-800 dark:text-neutral-200 text-center font-semibold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BookingModal;
