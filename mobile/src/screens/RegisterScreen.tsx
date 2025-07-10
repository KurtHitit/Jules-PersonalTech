// mobile/src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/navigation/types"; // Use AuthStackParamList
import * as analyticsService from '@/services/analyticsService';
// import * as authService from '@/services/authService'; // To be implemented
// import { useAuth } from '@/context/AuthContext'; // To be implemented

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

interface Props {
  navigation: RegisterScreenNavigationProp; // Corrected to use AuthStackParamList
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuth(); // From AuthContext, to auto-login after register

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert(
        "Validation Error",
        "Email, password, and confirm password are required."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters long."
      );
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Placeholder for actual registration logic
      console.log("Attempting registration with:", {
        email,
        password,
        firstName,
        lastName,
      });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      // const userData = await authService.register({ email, password, firstName, lastName });
      // login(userData.token, userData.user); // Auto-login: Update AuthContext

      Alert.alert(
        "Registration Success (Mock)",
        "You are now registered and logged in!"
      );
      analyticsService.trackEvent('Registration Success', { email, firstName, lastName });
    } catch (error: any) {
      console.error("Registration failed:", error);
      Alert.alert(
        "Registration Failed",
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg p-3 mb-4 w-full";
  const labelClass =
    "text-base font-medium text-neutral-700 dark:text-neutral-300 mb-1";

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-neutral-900">
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
        <View className="p-6 md:p-8">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 text-center">
            Create Account
          </Text>

          <View>
            <Text className={labelClass}>First Name (Optional)</Text>
            <TextInput
              className={inputClass}
              placeholder="John"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoComplete="name-given"
            />

            <Text className={labelClass}>Last Name (Optional)</Text>
            <TextInput
              className={inputClass}
              placeholder="Doe"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoComplete="name-family"
            />

            <Text className={labelClass}>Email Address*</Text>
            <TextInput
              className={inputClass}
              placeholder="you@example.com"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Text className={labelClass}>Password*</Text>
            <TextInput
              className={inputClass}
              placeholder="Minimum 6 characters"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <Text className={labelClass}>Confirm Password*</Text>
            <TextInput
              className={inputClass}
              placeholder="Re-enter your password"
              placeholderTextColor={
                Platform.OS === "android" ? "#999" : undefined
              }
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <TouchableOpacity
            className={`mt-6 py-3 px-4 rounded-lg ${
              isLoading
                ? "bg-green-300"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800"
            }`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Register
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="login-link"
            className="mt-6"
            onPress={() => navigation.navigate("Login")} // Navigate to LoginScreen
            disabled={isLoading}
          >
            <Text className="text-blue-600 dark:text-blue-400 text-center font-medium">
              Already have an account? Login here.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
