// mobile/src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import ItemListScreen from '@/screens/ItemListScreen';
import AddItemScreen from '@/screens/AddItemScreen';
// import ItemDetailScreen from '@/screens/ItemDetailScreen'; // For when it's created

import { RootStackParamList } from './types'; // Import the param list

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ItemList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1F2937', // bg-gray-800 dark
          },
          headerTintColor: '#FFFFFF', // text-white
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // headerShown: false, // Uncomment to hide header globally
        }}
      >
        <Stack.Screen
          name="ItemList"
          component={ItemListScreen}
          options={{ title: 'My Belongings' }}
        />
        <Stack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{
            title: 'Add New Item',
            // presentation: 'modal', // Optional: if you want it to slide up like a modal
          }}
        />
        {/*
        <Stack.Screen
          name="ItemDetail"
          component={ItemDetailScreen}
          options={({ route }) => ({ title: `Item ${route.params.itemId}` })} // Dynamic title
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
