// mobile/src/navigation/types.ts

// Define param list for the stack navigator
// This helps with type checking for navigation props and route params

export type RootStackParamList = {
  ItemList: undefined; // No parameters expected for ItemListScreen
  AddItem: undefined; // No parameters expected for AddItemScreen
  ItemDetail: { itemId: string }; // Expects an itemId parameter
  // Add other screens and their parameters here
  // e.g., Settings: undefined;
};

// You can also define types for specific navigation props if needed,
// though often StackNavigationProp from @react-navigation/stack is used directly,
// generic over RootStackParamList and the current screen's name.
// Example:
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RouteProp } from '@react-navigation/native';

// export type ItemListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ItemList'>;
// export type ItemDetailScreenRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;
// export type ItemDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ItemDetail'>;
