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

// For now, we'll define a simple structure for the form.
// This can be expanded based on the backend Item model.
interface ItemFormData {
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  // Add more fields as needed: purchaseDate, price, retailer, notes etc.
}

const AddItemScreen: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name: keyof ItemFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Item name is required.');
      return;
    }
    // Add more validation as needed

    setIsSubmitting(true);
    console.log('Submitting item data:', formData);

    try {
      // Actual service call to the mobile item service
      const newItem = await itemMobileService.addItem(formData); // Assuming addItem returns the created item or relevant data

      Alert.alert('Success', `Item "${newItem.name}" added successfully!`);
      // navigation.goBack(); // Go back to the item list
      // Or navigate to the new item's detail page if applicable
      // navigation.replace('ItemDetail', { itemId: newItem.id });

      // For now, just clear form and navigate back
      setFormData({ name: '', category: '', brand: '', model: '', serialNumber: '' });
      if(navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // If it can't go back (e.g. it's the first screen in a stack),
        // you might navigate to a default screen or handle as appropriate.
        // For now, we'll just log, as ItemList is the initial route.
        console.log("Cannot go back from AddItemScreen, already at top of stack or standalone.");
      }

    } catch (error) {
      console.error('Failed to add item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
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
