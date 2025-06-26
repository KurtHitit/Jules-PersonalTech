// mobile/src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, Button, Text } from 'react-native'; // Added Button, Text for logout example

import ItemListScreen from '@/screens/ItemListScreen';
import AddItemScreen from '@/screens/AddItemScreen';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
// import ItemDetailScreen from '@/screens/ItemDetailScreen';

import { RootStackParamList, AuthStackParamList, MainAppStackParamList } from './types';
import { useAuth } from '@/context/AuthContext';

// Define stack navigators. RootStackParamList is broad for now.
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainAppStackParamList>();
// const RootStack = createNativeStackNavigator<RootStackParamList>(); // If needed for a true root stack switcher

const commonScreenOptions = {
  headerStyle: {
    backgroundColor: '#1F2937', // bg-gray-800 dark
  },
  headerTintColor: '#FFFFFF', // text-white
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const AuthScreens = () => (
  <AuthStack.Navigator screenOptions={commonScreenOptions}>
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
  </AuthStack.Navigator>
);

const MainAppScreens = () => {
  const { logout, user } = useAuth(); // Get logout function from context
  return (
    <MainStack.Navigator initialRouteName="ItemList" screenOptions={commonScreenOptions}>
      <MainStack.Screen
        name="ItemList"
        component={ItemListScreen}
        options={{
          title: user?.firstName ? `Items for ${user.firstName}` : 'My Belongings',
          headerRight: () => (
            <Button onPress={logout} title="Logout" color={Platform.OS === 'ios' ? "#fff" : "#3B82F6"} />
          ),
        }}
      />
      <MainStack.Screen name="AddItem" component={AddItemScreen} options={{ title: 'Add New Item' }} />
      {/* <MainStack.Screen name="ItemDetail" component={ItemDetailScreen} options={({ route }) => ({ title: `Item ${route.params.itemId}` })} /> */}
    </MainStack.Navigator>
  );
};


const AppNavigator = () => {
  const { userToken, isLoading } = useAuth(); // Use values from AuthContext

  if (isLoading) {
    // We haven't finished checking for the token yet or are in midst of auth operation
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainAppScreens /> : <AuthScreens />}
    </NavigationContainer>
  );
};

export default AppNavigator;
