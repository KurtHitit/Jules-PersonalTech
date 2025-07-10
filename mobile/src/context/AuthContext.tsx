// mobile/src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import * as authService from "@/services/authService"; // Using mock service for now
import { UserProfile } from "@/services/authService"; // Import UserProfile type
import { registerForPushNotificationsAsync, registerTokenWithBackend } from '@/services/pushNotificationService';
import { ActivityIndicator, View } from "react-native";
import * as Notifications from 'expo-notifications';

interface AuthContextType {
  userToken: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>; // Password optional for potential future (e.g. social)
  logout: () => Promise<void>;
  register: (userData: authService.RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check token status

  useEffect(() => {
    // Check for token on app startup
    const bootstrapAsync = async () => {
      let token: string | null = null;
      let currentUser: UserProfile | null = null;
      try {
        token = await authService.getAuthToken();
        if (token) {
          // Here you might want to validate the token with the backend
          // For mock, we'll use getCurrentUser which also uses mock logic based on token
          currentUser = await authService.getCurrentUser(); // This needs to be robust
          if (!currentUser) {
            // Token might be invalid or user deleted
            console.log("[AuthContext] Token found but no user, logging out.");
            await authService.logout(); // Clears bad token
            token = null; // Ensure token is cleared locally
          }
        }
      } catch (e) {
        console.error("[AuthContext] Error during token bootstrap:", e);
        // Can decide to clear token if validation fails severely
        // await authService.removeAuthToken();
        // token = null;
      }
      setUserToken(token);
      setUser(currentUser);
      setIsLoading(false);
    };

    bootstrapAsync();

    // Handle incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login(email, password); // Using mock service
      setUserToken(authResponse.token);
      setUser(authResponse.user);
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await registerTokenWithBackend(token);
      }
      // AsyncStorage for token is handled by authService.login (mock or real)
    } catch (error) {
      console.error("[AuthContext] Login failed:", error);
      setUserToken(null); // Ensure logged out state on failure
      setUser(null);
      throw error; // Re-throw for the UI to handle
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: authService.RegisterData) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.register(userData); // Using mock service
      setUserToken(authResponse.token);
      setUser(authResponse.user);
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await registerTokenWithBackend(token);
      }
      // AsyncStorage for token is handled by authService.register (mock or real)
    } catch (error) {
      console.error("[AuthContext] Registration failed:", error);
      setUserToken(null);
      setUser(null);
      throw error; // Re-throw for the UI to handle
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout(); // Clears token from AsyncStorage via service
    } catch (error) {
      console.error("[AuthContext] Error during logout service call:", error);
      // Even if service call fails, clear local state
    } finally {
      setUserToken(null);
      setUser(null);
      setIsLoading(false); // Though usually app will navigate away
    }
  };

  if (isLoading && userToken === null) {
    // Show loader only during initial token check
    // This specific loading screen might be redundant if AppNavigator also shows one.
    // However, this ensures context isn't prematurely used.
    // For a smoother experience, AppNavigator's loader is often sufficient.
    // Consider removing this if AppNavigator's loading indicator covers it.
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
    <AuthContext.Provider
      value={{ userToken, user, isLoading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
