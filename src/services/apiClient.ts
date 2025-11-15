// src/services/apiClient.ts
import axios from 'axios';
import { Alert } from 'react-native';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add custom headers
apiClient.interceptors.request.use(
  (config) => {
    // Add custom header to every request
    config.headers['X-Client-Platform'] = 'React-Native';
    
    console.log('🚀 API Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global response handling and transformation
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    // Transform specific responses
    if (response.config.url?.includes('/auth/login') && response.status === 200) {
      // Transform login response to match our expected format
      const transformedResponse = {
        ...response,
        data: {
          success: true,
          token: response.data.accessToken || 'simulated_token_xyz',
          user: response.data,
          message: 'Login successful',
        },
      };
      console.log('🔄 Transformed login response');
      return transformedResponse;
    }

    // Transform products response if needed
    if (response.config.url?.includes('/products') && response.status === 200) {
      const transformedResponse = {
        ...response,
        data: {
          ...response.data,
          success: true,
          message: 'Products fetched successfully',
        },
      };
      return transformedResponse;
    }

    // Transform cart response if needed
    if (response.config.url?.includes('/carts') && response.status === 200) {
      const transformedResponse = {
        ...response,
        data: {
          ...response.data,
          success: true,
          message: 'Cart data fetched successfully',
        },
      };
      return transformedResponse;
    }

    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      code: error.code,
    });
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 400:
          errorMessage = 'Bad request - please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized access - please login again';
          break;
        case 403:
          errorMessage = 'Forbidden - you do not have permission';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Internal server error - please try again later';
          break;
        case 502:
          errorMessage = 'Bad gateway - server is down';
          break;
        case 503:
          errorMessage = 'Service unavailable';
          break;
        default:
          errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please check your connection';
      } else {
        errorMessage = 'Network error - no response from server';
      }
    } else {
      // Something happened in setting up the request
      errorMessage = error.message || 'Request configuration error';
    }
    
    // Enhance error object with user-friendly message
    error.userMessage = errorMessage;
    
    // Show alert for critical errors (optional)
    if (error.response?.status >= 500) {
      Alert.alert('Server Error', errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Helper methods for common API calls
export const apiMethods = {
  // Auth methods
  login: (credentials: { username: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  
  // Product methods
  getProducts: (limit: number = 30, skip: number = 0) =>
    apiClient.get(`/products?limit=${limit}&skip=${skip}`),
  
  getProduct: (id: string | number) =>
    apiClient.get(`/products/${id}`),
  
  getProductsByCategory: (category: string) =>
    apiClient.get(`/products/category/${category}`),
  
  searchProducts: (query: string) =>
    apiClient.get(`/products/search?q=${query}`),
  
  // Cart methods
  getCart: (id: string | number = 1) =>
    apiClient.get(`/carts/${id}`),
  
  // User methods
  getUser: (id: string | number) =>
    apiClient.get(`/users/${id}`),
};

export default apiClient;