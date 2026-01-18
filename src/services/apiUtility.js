import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {EndPoint} from './index';
import axiosRetry from 'axios-retry';

// Public API routes that don't require an auth token
const PUBLIC_API_ROUTES = [
  'authenticate-user',
  'send-otp-authenticate-user',
  'register-user',
  'static-content-by-type',
];

// Create an Axios instance
const apiClient = axios.create({
  baseURL: EndPoint, // API base URL from environment config
  timeout: 200000,
  headers: {
    Accept: 'application/json',
  },
});

// Attach axios-retry
axiosRetry(apiClient, {
  retries: 3, // Retry count
  retryDelay: retryCount => {
    console.log(`Retry attempt #${retryCount}`);
    return axiosRetry.exponentialDelay(retryCount); // Delay: 1s, 2s, 4s...
  },
  retryCondition: error => {
    // const status = error?.response?.status;

    // Retry on network errors or these HTTP status codes
    return axiosRetry.isNetworkError(error);
  },
  shouldResetTimeout: true, // Recommended for long-running requests
});

// Request interceptor to add the auth token (if required)
apiClient.interceptors.request.use(
  async config => {
    // Skip token for public APIs
    if (config.data instanceof FormData) {
      config.headers['content-type'] = 'multipart/form-data';
    } else {
      config.headers['content-type'] = 'application/json';
    }

    if (PUBLIC_API_ROUTES.includes(config.url)) {
      return config;
    } else {
      // Get the auth token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // console.log("Token::", token)
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    // console.log('config::::', config);

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // Return the successful response
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with a status other than 2xx
      const {status, data} = error.response;

      switch (status) {
        case 400:
          console.error('Bad Request:', data.message || 'Invalid request.');
          break;
        case 401:
          console.error(
            'Unauthorized: Token is invalid or expired. Redirecting to login.',
          );
          AsyncStorage.removeItem('authToken');
          // Add logic to navigate to the login screen if needed
          break;
        case 403:
          console.error(
            'Forbidden: You do not have permission to access this resource.',
          );
          break;
        case 404:
          console.error(
            'Not Found:',
            data.message || 'The requested resource does not exist.',
          );
          break;
        case 422:
          console.error('Validation Error:', data.errors || 'Invalid input.');
          break;
        case 500:
          console.error('Server Error: Something went wrong on the server.');
          break;
        default:
          console.error(
            `Unexpected Error [${status}]:`,
            data.message || 'An unknown error occurred.',
          );
      }
    } else if (error.request) {
      // No response received
      // console.error('Error Config:', error.request);
      console.error(
        'Network Error: No response from server. Check your connection.',
      );
    } else {
      // Other errors
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  },
);

// Generalized API methods
export const apiGet = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPost = async (url, data = {}) => {
  // console.log('Data:', data);
  // console.log('URL:', url);
  try {
    // console.log('Data:', data);
    // console.log('URL:', url);
    // console.log('try in the utils file');
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPut = async (url, data = {}) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiDelete = async url => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper methods for token management
export const saveAuthToken = async token => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    console.error('Error saving auth token:', error);
  }
};

export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

export default apiClient;
