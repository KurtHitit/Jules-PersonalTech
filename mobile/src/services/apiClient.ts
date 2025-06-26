// mobile/src/services/apiClient.ts
import axios from 'axios';
import { getAuthToken } from './authService'; // To fetch the token

// Define your backend's base URL.
// For development, if backend is on localhost and mobile is on emulator/device:
// - Android Emulator: 'http://10.0.2.2:PORT' (PORT is your backend's port, e.g., 3000)
// - iOS Simulator: 'http://localhost:PORT'
// - Physical Device: Your computer's network IP address (e.g., 'http://192.168.1.X:PORT')
// Ensure your backend allows CORS from this origin if running on different domains/ports during development.
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust as needed for your setup

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      // Ensure headers object exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[APIClient] Token added to request headers for URL:', config.url);
    } else {
      console.log('[APIClient] No token found, request sent without Authorization header for URL:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('[APIClient] Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling or token refresh logic
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('[APIClient] Response received:', response.status, 'for URL:', response.config.url);
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error(
      '[APIClient] Error in response for URL:', error.config?.url,
      'Status:', error.response?.status,
      'Data:', error.response?.data
    );
    // Example: Handle 401 Unauthorized globally (e.g., trigger logout)
    // if (error.response && error.response.status === 401) {
    //   console.warn('[APIClient] Received 401 Unauthorized. Consider logging out user.');
    //   // Potentially call logout function from authService or dispatch a global logout action
    //   // Be careful with circular dependencies if importing authService here directly for logout.
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
