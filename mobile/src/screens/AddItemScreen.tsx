// mobile/src/screens/AddItemScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
// Placeholder for navigation props
// import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/navigation/types';

type AddItemScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddItem'
>;

interface Props {
  navigation: AddItemScreenNavigationProp;
}

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // Import date picker
import * as itemMobileService from '@/services/itemService'; // Ensure this is imported
import { IItemPhoto, IItemDocument } from '@/../../backend/src/models/Item'; // For photo/doc types

// Expanded form data structure
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
  photos: Array<Partial<IItemPhoto>>; // Array for photo URLs and captions
  documents: Array<Partial<IItemDocument>>; // Array for document URLs, filenames, types
}

const AddItemScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    purchasePrice: '',
    currency: 'USD', // Default currency
    retailer: '',
    notes: '',
    photos: [{ url: '', caption: '' }], // Start with one empty photo entry
    documents: [{ url: '', filename: '', type: 'other' }], // Start with one empty document entry
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name: keyof ItemFormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListInputChange = (
    listName: 'photos' | 'documents',
    index: number,
    fieldName: keyof IItemPhoto | keyof IItemDocument,
    value: string
  ) => {
    setFormData(prev => {
      const newList = [...prev[listName]];
      // @ts-ignore - TypeScript struggles with dynamic field assignment on union types here
      newList[index] = { ...newList[index], [fieldName]: value };
      return { ...prev, [listName]: newList };
    });
  };

  const addListItem = (listName: 'photos' | 'documents') => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], listName === 'photos' ? { url: '', caption: '' } : { url: '', filename: '', type: 'other' }],
    }));
  };

  const removeListItem = (listName: 'photos' | 'documents', index: number) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index),
    }));
  };


  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS until user dismisses
    if (selectedDate) {
      setFormData(prev => ({ ...prev, purchaseDate: selectedDate }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Item name is required.');
      return;
    }
    // Convert purchasePrice to number, handle potential NaN
    const purchasePriceNumber = parseFloat(formData.purchasePrice);
    if (formData.purchasePrice.trim() !== '' && isNaN(purchasePriceNumber)) {
        Alert.alert('Validation Error', 'Purchase price must be a valid number.');
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
      purchasePrice: formData.purchasePrice.trim() === '' ? undefined : purchasePriceNumber,
      currency: formData.currency || undefined,
      retailer: formData.retailer || undefined,
      notes: formData.notes || undefined,
      photos: formData.photos.filter(p => p.url && p.url.trim() !== ''), // Filter out empty photo URLs
      documents: formData.documents.filter(d => d.url && d.url.trim() !== '' && d.filename && d.filename.trim() !== ''), // Filter out empty/incomplete docs
    };

    console.log('Submitting item data:', submissionData);

    try {
      const newItem = await itemMobileService.addItem(submissionData);
      Alert.alert('Success', `Item "${newItem.name}" added successfully!`);

      // Reset form (optional, or clear specific fields)
      // setFormData({ ...initial empty state... });
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      Alert.alert('Error', `Failed to add item: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-1 w-full";
  const subSectionClass = "my-3 p-3 border border-dashed border-neutral-400 dark:border-neutral-500 rounded-md";
  const labelClass = "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Add New Item
          </Text>

          <View>
            <Text className={labelClass}>Item Name*</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., My Awesome Laptop"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
            />

            <Text className={labelClass}>Category</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Electronics, Furniture"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.category}
              onChangeText={value => handleInputChange('category', value)}
            />

            <Text className={labelClass}>Brand</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Apple, Sony"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.brand}
              onChangeText={value => handleInputChange('brand', value)}
            />

            <Text className={labelClass}>Model</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., MacBook Pro 16, WH-1000XM4"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.model}
              onChangeText={value => handleInputChange('model', value)}
            />

            <Text className={labelClass}>Serial Number</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., C02XXXXXX"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.serialNumber}
              onChangeText={value => handleInputChange('serialNumber', value)}
            />

            {/* Purchase Date */}
            <Text className={labelClass}>Purchase Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-4">
              <TextInput
                className={inputClass}
                editable={false}
                value={formData.purchaseDate ? formData.purchaseDate.toLocaleDateString() : 'Select a date'}
                placeholder="Select a date"
                placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.purchaseDate || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {/* Purchase Price */}
            <Text className={labelClass}>Purchase Price</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., 1299.99"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.purchasePrice}
              onChangeText={value => handleInputChange('purchasePrice', value)}
              keyboardType="numeric"
            />

            {/* Currency */}
            <Text className={labelClass}>Currency</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., USD, EUR"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.currency}
              onChangeText={value => handleInputChange('currency', value)}
              autoCapitalize="characters"
            />

            {/* Retailer */}
            <Text className={labelClass}>Retailer</Text>
            <TextInput
              className={inputClass}
              placeholder="e.g., Apple Store, Amazon"
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.retailer}
              onChangeText={value => handleInputChange('retailer', value)}
            />

            {/* Notes */}
            <Text className={labelClass}>Notes</Text>
            <TextInput
              className={`${inputClass} h-24`}
              placeholder="Any additional notes about the item..."
              placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
              value={formData.notes}
              onChangeText={value => handleInputChange('notes', value)}
              multiline
              textAlignVertical="top" // For Android
            />
          </View>

          {/* Photos Section */}
          <View className={subSectionClass}>
            <Text className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Photos</Text>
            {formData.photos.map((photo, index) => (
              <View key={`photo-${index}`} className="mb-3 p-2 border border-neutral-200 dark:border-neutral-700 rounded">
                <TextInput
                  className={inputClass}
                  placeholder="Photo URL"
                  value={photo.url || ''}
                  onChangeText={value => handleListInputChange('photos', index, 'url', value)}
                />
                <TextInput
                  className={inputClass}
                  placeholder="Caption (optional)"
                  value={photo.caption || ''}
                  onChangeText={value => handleListInputChange('photos', index, 'caption', value)}
                />
                {formData.photos.length > 1 && (
                  <TouchableOpacity onPress={() => removeListItem('photos', index)} className="bg-red-500 p-2 rounded self-end mt-1">
                    <Text className="text-white text-xs">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={() => addListItem('photos')} className="bg-blue-500 p-2 rounded self-start">
              <Text className="text-white">Add Photo URL</Text>
            </TouchableOpacity>
          </View>

          {/* Documents Section */}
          <View className={subSectionClass}>
            <Text className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Documents</Text>
            {formData.documents.map((doc, index) => (
              <View key={`doc-${index}`} className="mb-3 p-2 border border-neutral-200 dark:border-neutral-700 rounded">
                <TextInput
                  className={inputClass}
                  placeholder="Document URL"
                  value={doc.url || ''}
                  onChangeText={value => handleListInputChange('documents', index, 'url', value)}
                />
                <TextInput
                  className={inputClass}
                  placeholder="Filename"
                  value={doc.filename || ''}
                  onChangeText={value => handleListInputChange('documents', index, 'filename', value)}
                />
                {/* Basic Picker for Document Type - can be improved with a custom component or library */}
                <Text className={labelClass}>Document Type</Text>
                 <TextInput
                    className={inputClass}
                    placeholder="receipt, warranty, manual, other"
                    value={doc.type || 'other'}
                    onChangeText={value => handleListInputChange('documents', index, 'type', value as IItemDocument['type'])}
                 />
                {formData.documents.length > 1 && (
                  <TouchableOpacity onPress={() => removeListItem('documents', index)} className="bg-red-500 p-2 rounded self-end mt-1">
                    <Text className="text-white text-xs">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={() => addListItem('documents')} className="bg-blue-500 p-2 rounded self-start">
              <Text className="text-white">Add Document URL</Text>
            </TouchableOpacity>
          </View>


          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isSubmitting ? 'Saving...' : 'Save Item'}
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
