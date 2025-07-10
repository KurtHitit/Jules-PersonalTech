// mobile/src/services/authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the expected shape of user data and auth responses
// These should align with what your backend API returns
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // add other fields your backend's /api/auth/me might return
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  message?: string; // Optional message from backend
}

export interface RegisterData {
  email: string;
  password?: string; // Password will be sent to backend, not stored directly here after this call
  firstName?: string;
  lastName?: string;
}

const API_BASE_URL = "http://localhost:3000/api/auth"; // Replace with your actual backend URL / ngrok for dev
const AUTH_TOKEN_KEY = "userAuthToken";

import axios from "axios"; // Assuming axios is installed

// --- API Helper Functions ---

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add an interceptor to include the auth token in requests
// This is more useful for services that always require auth, like itemService.
// For authService itself, token is handled more directly (e.g., for /me endpoint).
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Actual API Functions ---

/**
 * Logs in a user via API.
 * @param email User's email.
 * @param password User's password.
 * @returns A promise that resolves to an AuthResponse.
 */
export const login = async (
  email: string,
  password?: string
): Promise<AuthResponse> => {
  console.log("[AuthService API] Logging in with:", {
    email,
    password: password ? "******" : undefined,
  });
  try {
    const response = await apiClient.post<AuthResponse>("/login", {
      email,
      password,
    });
    if (response.data && response.data.token) {
      await storeAuthToken(response.data.token);
      console.log(
        "[AuthService API] Login successful for:",
        response.data.user.email
      );
      return response.data;
    } else {
      // Should not happen if backend is consistent
      throw new Error("Login response did not include token or user data.");
    }
  } catch (error: any) {
    console.error(
      "[AuthService API] Login failed:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Login failed. Please check your credentials."
    );
  }
};

/**
 * Registers a new user via API.
 * @param userData User registration data.
 * @returns A promise that resolves to an AuthResponse.
 */
export const register = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  console.log("[AuthService API] Registering user:", userData.email);
  try {
    const response = await apiClient.post<AuthResponse>("/register", userData);
    if (response.data && response.data.token) {
      await storeAuthToken(response.data.token);
      console.log(
        "[AuthService API] Registration successful for:",
        response.data.user.email
      );
      return response.data;
    } else {
      throw new Error(
        "Registration response did not include token or user data."
      );
    }
  } catch (error: any) {
    console.error(
      "[AuthService API] Registration failed:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Registration failed. Please try again."
    );
  }
};

/**
 * Logs out the current user.
 * Removes the auth token from storage. Could also call a backend logout endpoint if available.
 */
export const logout = async (): Promise<void> => {
  console.log("[AuthService API] Logging out...");
  // Optional: Call backend logout endpoint
  // try {
  //   await apiClient.post('/logout'); // Assuming a /logout endpoint that invalidates server session/token
  // } catch (error) {
  //   console.error('[AuthService API] Backend logout call failed (continuing local logout):', error);
  // }
  await removeAuthToken(); // Always remove local token
  console.log("[AuthService API] User logged out locally.");
};

/**
 * Retrieves the current authenticated user's profile from /me endpoint.
 * @returns A promise that resolves to UserProfile or null if not authenticated or error.
 */
export const getCurrentUser = async (): Promise<UserProfile | null> => {
  console.log("[AuthService API] Getting current user profile...");
  const token = await getAuthToken(); // Token is needed for the /me request via interceptor
  if (!token) {
    console.log("[AuthService API] No token found, cannot fetch user profile.");
    return null;
  }

  try {
    // The interceptor will add the token to this request's headers
    const response = await apiClient.get<UserProfile>("/me");
    console.log(
      "[AuthService API] User profile fetched successfully:",
      response.data.email
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "[AuthService API] Failed to fetch user profile:",
      error.response?.data?.message || error.message
    );
    // If token is invalid (e.g. 401 from /me), it might be good to clear it
    if (error.response?.status === 401) {
      console.log(
        "[AuthService API] Token invalid or expired. Clearing local token."
      );
      await removeAuthToken();
    }
    return null; // Or throw error depending on how AuthContext wants to handle this
  }
};

/**
 * Deletes the authenticated user's account.
 * Removes the auth token from storage after successful deletion.
 */
export const deleteAccount = async (): Promise<void> => {
  console.log("[AuthService API] Deleting user account...");
  try {
    await apiClient.delete("/delete-account");
    await removeAuthToken(); // Clear token after successful deletion
    console.log("[AuthService API] User account deleted successfully.");
  } catch (error: any) {
    console.error(
      "[AuthService API] Account deletion failed:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message || "Account deletion failed. Please try again."
    );
  }
};

// --- AsyncStorage Helper Functions (remain the same) ---

/**
 * Stores the authentication token in AsyncStorage.
 * @param token The JWT token string.
 */
export const storeAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    console.log("[AuthService Storage] Token stored successfully.");
  } catch (e) {
    console.error("[AuthService Storage] Failed to store auth token.", e);
    // Optionally re-throw or handle error appropriately
  }
};

/**
 * Retrieves the authentication token from AsyncStorage.
 * @returns A promise that resolves to the token string, or null if not found.
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (token) console.log("[AuthService Storage] Token retrieved.");
    else console.log("[AuthService Storage] No token found.");
    return token;
  } catch (e) {
    console.error("[AuthService Storage] Failed to retrieve auth token.", e);
    return null;
  }
};

/**
 * Removes the authentication token from AsyncStorage.
 */
export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    console.log("[AuthService Storage] Token removed successfully.");
  } catch (e) {
    console.error("[AuthService Storage] Failed to remove auth token.", e);
  }
};

// --- TODO: Implement Actual API Calls ---
// Replace mock functions above with functions like these:

/*
export const login_API = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }
  const data: AuthResponse = await response.json();
  await storeAuthToken(data.token);
  return data;
};

// Similar API call functions for register, getCurrentUser (fetch /me with token in header)
*/
