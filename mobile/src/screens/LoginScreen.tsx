// mobile/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@/navigation/types'; // Use AuthStackParamList
// import * as authService from '@/services/authService'; // To be implemented
import { useAuth } from '@/context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp; // Corrected to use AuthStackParamList
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // isLoading state is now managed by AuthContext, but individual screens can have their own if needed for UI elements
  // const [isScreenLoading, setIsScreenLoading] = useState(false);
  const { login, isLoading: isAuthLoading } = useAuth(); // Use login from AuthContext

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return;
    }
    // setIsScreenLoading(true); // If using screen-specific loader
    try {
      await login(email, password); // Call context login
      // Navigation to main app stack is handled by AppNavigator's reaction to AuthContext state change
      // Alert.alert('Login Success (Mock)', 'You are now logged in!'); // Context handles this or UI updates
    } catch (error: any) {
      console.error('Login failed from screen:', error);
      // Error alert is now potentially handled by context or can be customized here
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      // setIsScreenLoading(false);
    }
  };

  const inputClass = "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass = "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900 justify-center">
      <View className="p-6 md:p-8">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">
          Login to My Belongings Hub
        </Text>

        <View>
          <Text className={labelClass}>Email Address</Text>
          <TextInput
            className={inputClass}
            placeholder="you@example.com"
            placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text className={labelClass}>Password</Text>
          <TextInput
            className={inputClass}
            placeholder="••••••••"
            placeholderTextColor={Platform.OS === 'android' ? "#999" : undefined}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <TouchableOpacity
          className={`mt-6 py-3 px-4 rounded-lg ${isAuthLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
          onPress={handleLogin}
          disabled={isAuthLoading}
        >
          {isAuthLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-6"
          onPress={() => navigation.navigate('Register')} // Navigate to RegisterScreen
          disabled={isAuthLoading}
        >
          <Text className="text-blue-600 dark:text-blue-400 text-center font-medium">
            Don't have an account? Register here.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
