// mobile/src/navigation/AppNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, Button, Platform, Text } from "react-native";
import { getGamificationData } from "@/services/gamificationService";
import { useEffect, useState } from "react";

import ItemListScreen from "@/screens/ItemListScreen";
import AddItemScreen from "@/screens/AddItemScreen";
import SuccessScreen from "@/screens/SuccessScreen";
import RemindersScreen from "@/screens/RemindersScreen";
import AddReminderScreen from "@/screens/AddReminderScreen";
import DiagnosticScreen from "@/screens/DiagnosticScreen";
import ServiceHistoryScreen from "@/screens/ServiceHistoryScreen";
import AddServiceEntryScreen from "@/screens/AddServiceEntryScreen";
import TechnicianListScreen from "@/screens/TechnicianListScreen";
import TechnicianDetailScreen from "@/screens/TechnicianDetailScreen";
import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import GroupListScreen from "@/screens/GroupListScreen";
import GroupDetailScreen from "@/screens/GroupDetailScreen";
import ForumThreadListScreen from "@/screens/ForumThreadListScreen";
import ForumThreadDetailScreen from "@/screens/ForumThreadDetailScreen";
import CreateForumThreadScreen from "@/screens/CreateForumThreadScreen";
// import ItemDetailScreen from '@/screens/ItemDetailScreen';
import ChatScreen from '@/screens/ChatScreen';
import ConversationListScreen from '@/screens/ConversationListScreen';
import NotificationListScreen from '@/screens/NotificationListScreen';
import ReviewListScreen from '@/screens/ReviewListScreen';
import CreateReviewScreen from '@/screens/CreateReviewScreen';
import BadgeCabinetScreen from '@/screens/BadgeCabinetScreen';
import LeaderboardScreen from '@/screens/LeaderboardScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import CreateListingScreen from '@/screens/CreateListingScreen';
import ListingDetailScreen from '@/screens/ListingDetailScreen';
import ListingListScreen from '@/screens/ListingListScreen';
import OrderListScreen from '@/screens/OrderListScreen';
import DisputeListScreen from '@/screens/DisputeListScreen';
import ReferralScreen from '@/screens/ReferralScreen';
import NPSFeedbackScreen from '@/screens/NPSFeedbackScreen';
import ChangelogScreen from '@/screens/ChangelogScreen';
import FeatureFlagsScreen from '@/screens/FeatureFlagsScreen';

import { AuthStackParamList, MainAppStackParamList } from "./types";
import { useAuth } from "@/context/AuthContext";

// Define stack navigators. RootStackParamList is broad for now.
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainAppStackParamList>();
// const RootStack = createNativeStackNavigator<RootStackParamList>(); // If needed for a true root stack switcher

const commonScreenOptions = {
  headerStyle: {
    backgroundColor: "#1F2937", // bg-gray-800 dark
  },
  headerTintColor: "#FFFFFF", // text-white
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const AuthScreens = () => (
  <AuthStack.Navigator screenOptions={commonScreenOptions}>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{ title: "Create Account" }}
    />
  </AuthStack.Navigator>
);

const MainAppScreens = () => {
  const { logout, user } = useAuth(); // Get logout function from context
  const [gamificationData, setGamificationData] = useState<{ xp: number; level: number } | null>(null);

  useEffect(() => {
    const fetchGamification = async () => {
      if (user) {
        const data = await getGamificationData();
        setGamificationData(data);
      }
    };
    fetchGamification();
  }, [user]);

  return (
    <MainStack.Navigator
      initialRouteName="ItemList"
      screenOptions={commonScreenOptions}
    >
      <MainStack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={{
          title: user?.firstName
            ? `Items for ${user.firstName}`
            : "My Belongings",
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {gamificationData && (
                <View style={{ marginRight: 10, alignItems: 'flex-end' }}>
                  <Text style={{ color: 'white', fontSize: 12 }}>XP: {gamificationData.xp}</Text>
                  <Text style={{ color: 'white', fontSize: 12 }}>Level: {gamificationData.level}</Text>
                </View>
              )}
              <Button
                onPress={logout}
                title="Logout"
                color={Platform.OS === "ios" ? "#fff" : "#3B82F6"}
              />
            </View>
          ),
        }}
      />
      <MainStack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{ title: "Add New Item" }}
      />
      <MainStack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ headerShown: false }} // Hide header for a cleaner success view
      />
      <MainStack.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{ title: "My Reminders" }}
      />
      <MainStack.Screen
        name="AddReminder"
        component={AddReminderScreen}
        options={({ route }) => ({
          title: route.params?.reminderId
            ? "Edit Reminder"
            : "Add New Reminder",
        })} // Dynamic title
      />
      <MainStack.Screen
        name="Diagnostic"
        component={DiagnosticScreen}
        options={{ title: "AI Diagnostic" }}
      />
      <MainStack.Screen
        name="ServiceHistory"
        component={ServiceHistoryScreen}
        options={{ title: "Service History" }}
      />
      <MainStack.Screen
        name="AddServiceEntry"
        component={AddServiceEntryScreen}
        options={({ route }) => ({
          title: route.params?.entryId
            ? "Edit Service Entry"
            : "Add Service Entry",
        })} // Dynamic title
      />
      <MainStack.Screen
        name="TechnicianList"
        component={TechnicianListScreen}
        options={{ title: "Find a Technician" }}
      />
      <MainStack.Screen
        name="TechnicianDetail"
        component={TechnicianDetailScreen}
        options={({ route }) => ({
          title: route.params?.technicianId
            ? "Technician Details"
            : "Technician",
        })} // Dynamic title
      />
      <MainStack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={({ route }) => ({ title: `Item ${route.params.itemId}` })}
      />
      <MainStack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({ title: `Chat with ${route.params.name}` })}
      />
      <MainStack.Screen
        name="ConversationList"
        component={ConversationListScreen}
        options={{ title: "Conversations" }}
      />
      <MainStack.Screen
        name="GroupList"
        component={GroupListScreen}
        options={{ title: "Groups" }}
      />
      <MainStack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: "Group Details" }}
      />
      <MainStack.Screen
        name="ForumThreadList"
        component={ForumThreadListScreen}
        options={{ title: "Forums" }}
      />
      <MainStack.Screen
        name="ForumThreadDetail"
        component={ForumThreadDetailScreen}
        options={{ title: "Thread" }}
      />
      <MainStack.Screen
        name="CreateForumThread"
        component={CreateForumThreadScreen}
        options={{ title: "Create Thread" }}
      />
      <MainStack.Screen
        name="NotificationList"
        component={NotificationListScreen}
        options={{ title: "Notifications" }}
      />
      <MainStack.Screen
        name="ReviewList"
        component={ReviewListScreen}
        options={{ title: "Reviews" }}
      />
      <MainStack.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{ title: "Submit Review" }}
      />
      <MainStack.Screen
        name="BadgeCabinet"
        component={BadgeCabinetScreen}
        options={{ title: "Badge Cabinet" }}
      />
      <MainStack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ title: "Leaderboard" }}
      />
      <MainStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <MainStack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{ title: "Create Listing" }}
      />
      <MainStack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: "Listing Details" }}
      />
      <MainStack.Screen
        name="ListingList"
        component={ListingListScreen}
        options={{ title: "Marketplace" }}
      />
      <MainStack.Screen
        name="OrderList"
        component={OrderListScreen}
        options={{ title: "My Orders" }}
      />
      <MainStack.Screen
        name="DisputeList"
        component={DisputeListScreen}
        options={{ title: "My Disputes" }}
      />
      <MainStack.Screen
        name="Referral"
        component={ReferralScreen}
        options={{ title: "Refer a Friend" }}
      />
      <MainStack.Screen
        name="NPSFeedback"
        component={NPSFeedbackScreen}
        options={{ title: "Feedback" }}
      />
      <MainStack.Screen
        name="Changelog"
        component={ChangelogScreen}
        options={{ title: "Changelog" }}
      />
      <MainStack.Screen
        name="FeatureFlags"
        component={FeatureFlagsScreen}
        options={{ title: "Feature Flags" }}
      />
    </MainStack.Navigator>
  );
};

const AppNavigator = ({ linking }: { linking?: any }) => {
  const { userToken, isLoading } = useAuth(); // Use values from AuthContext

  if (isLoading) {
    // We haven't finished checking for the token yet or are in midst of auth operation
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {userToken ? <MainAppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
};

export default AppNavigator;
