// mobile/src/navigation/types.ts

// Define param list for the stack navigators
// This helps with type checking for navigation props and route params

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainAppStackParamList = {
  ItemList: undefined;
  AddItem: undefined;
  ItemDetail: { itemId: string };
  Success: undefined;
  Reminders: undefined;
  AddReminder: { reminderId?: string };
  Diagnostic: { itemCategory?: string };
  ServiceHistory: { itemId: string };
  AddServiceEntry: { itemId: string; entryId?: string };
  TechnicianList: undefined;
  TechnicianDetail: { technicianId: string };
  Chat: { userId: string; name: string };
  ConversationList: undefined;
  GroupList: undefined;
  GroupDetail: { groupId: string };
  ForumThreadList: { groupId?: string };
  ForumThreadDetail: { threadId: string };
  CreateForumThread: { groupId?: string };
  NotificationList: undefined;
  ReviewList: { technicianId: string };
  CreateReview: { technicianId: string };
  BadgeCabinet: undefined;
  Leaderboard: undefined;
  Profile: undefined;
  CreateListing: undefined;
  ListingDetail: { listingId: string };
  ListingList: undefined;
  OrderList: undefined;
  DisputeList: undefined;
  Referral: undefined;
  NPSFeedback: undefined;
  Changelog: undefined;
  FeatureFlags: undefined;
  // Add other main app screens and their parameters here
  // e.g., Settings: undefined;
  // Profile: undefined;
};

// This RootStackParamList can be used if you have a top-level navigator
// that decides between Auth and MainApp stacks, or for modals that can appear over anything.
// For simplicity, if AppNavigator directly switches between stacks,
// you might not need a combined RootStackParamList at the AppNavigator level,
// but individual screens will use their respective stack's param list.
export type RootStackParamList = AuthStackParamList &
  MainAppStackParamList & {
    // This allows navigation from any screen in AuthStack to any screen in MainAppStack or vice-versa
    // if your navigator is structured to allow that directly.
    // However, typically you'd navigate to the *name of the stack* e.g. navigation.navigate('MainAppStack').
    // For now, merging them like this is a common approach for type safety across potential combined navigators.
    // Consider refining if you use nested navigators explicitly (e.g. Stack.Group).
    // If you have a loading/splash screen at the root before deciding Auth/Main:
    // InitialLoading: undefined;
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
