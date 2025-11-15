import axios from 'axios';
import { Alert } from 'react-native';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
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

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    if (response.config.url?.includes('/auth/login') && response.status === 200) {
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
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - please check your connection';
      } else {
        errorMessage = 'Network error - no response from server';
      }
    } else {
      errorMessage = error.message || 'Request configuration error';
    }
    
    error.userMessage = errorMessage;
    
    if (error.response?.status >= 500) {
      Alert.alert('Server Error', errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export const apiMethods = {
  login: (credentials: { username: string; password: string }) => 
    apiClient.post('/auth/login', credentials),
  
  getProducts: (limit: number = 30, skip: number = 0) =>
    apiClient.get(`/products?limit=${limit}&skip=${skip}`),
  
  getProduct: (id: string | number) =>
    apiClient.get(`/products/${id}`),
  
  getProductsByCategory: (category: string) =>
    apiClient.get(`/products/category/${category}`),
  
  searchProducts: (query: string) =>
    apiClient.get(`/products/search?q=${query}`),
  
  getCart: (id: string | number = 1) =>
    apiClient.get(`/carts/${id}`),
  
  getUser: (id: string | number) =>
    apiClient.get(`/users/${id}`),

  post: (url: string, data?: any) =>
    apiClient.post(url, data),

  get: (url: string, params?: any) =>
    apiClient.get(url, { params }),

  put: (url: string, data?: any) =>
    apiClient.put(url, data),

  patch: (url: string, data?: any) =>
    apiClient.patch(url, data),

  delete: (url: string) =>
    apiClient.delete(url),

  addToCart: (productId: number, quantity: number = 1) =>
    apiClient.post('/carts/add', {
      userId: 1, 
      products: [
        {
          id: productId,
          quantity: quantity,
        }
      ]
    }),
};

export default apiClient;