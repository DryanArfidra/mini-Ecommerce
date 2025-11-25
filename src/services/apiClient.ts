import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import KeychainService from './KeychainService';

const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Constants for cache
const CACHE_KEYS = {
  CATEGORIES: 'categories_cache',
  CATEGORIES_TIMESTAMP: 'categories_timestamp',
  LOCATION: 'location_cache',
  LOCATION_TIMESTAMP: 'location_timestamp',
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const LOCATION_CACHE_TTL = 2 * 60 * 1000; // 2 minutes untuk cache lokasi

// Cache utility functions
const cacheUtils = {
  isCacheValid: (timestamp: number, ttl: number = CACHE_TTL): boolean => {
    return Date.now() - timestamp < ttl;
  },

  getCachedCategories: async (): Promise<any[] | null> => {
    try {
      const [cachedData, timestamp] = await AsyncStorage.multiGet([
        CACHE_KEYS.CATEGORIES,
        CACHE_KEYS.CATEGORIES_TIMESTAMP
      ]);

      const categoriesJson = cachedData[0]?.[1];
      const timestampValue = timestamp[1]?.[1];

      if (categoriesJson && timestampValue) {
        const cacheTime = parseInt(timestampValue);
        if (cacheUtils.isCacheValid(cacheTime)) {
          console.log('📦 Using cached categories (valid)');
          return JSON.parse(categoriesJson);
        } else {
          console.log('🕒 Categories cache expired');
        }
      }
    } catch (error) {
      console.error('❌ Error reading categories cache:', error);
    }
    return null;
  },

  setCachedCategories: async (categories: any[]): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        [CACHE_KEYS.CATEGORIES, JSON.stringify(categories)],
        [CACHE_KEYS.CATEGORIES_TIMESTAMP, Date.now().toString()]
      ]);
      console.log('💾 Categories cached successfully');
    } catch (error) {
      console.error('❌ Error caching categories:', error);
    }
  },

  clearCategoriesCache: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        CACHE_KEYS.CATEGORIES,
        CACHE_KEYS.CATEGORIES_TIMESTAMP
      ]);
      console.log('🧹 Categories cache cleared');
    } catch (error) {
      console.error('❌ Error clearing categories cache:', error);
    }
  },

  // Cache untuk lokasi
  getCachedLocation: async (): Promise<any | null> => {
    try {
      const [cachedData, timestamp] = await AsyncStorage.multiGet([
        CACHE_KEYS.LOCATION,
        CACHE_KEYS.LOCATION_TIMESTAMP
      ]);

      const locationJson = cachedData[0]?.[1];
      const timestampValue = timestamp[1]?.[1];

      if (locationJson && timestampValue) {
        const cacheTime = parseInt(timestampValue);
        if (cacheUtils.isCacheValid(cacheTime, LOCATION_CACHE_TTL)) {
          console.log('📍 Using cached location (valid)');
          return JSON.parse(locationJson);
        } else {
          console.log('🕒 Location cache expired');
        }
      }
    } catch (error) {
      console.error('❌ Error reading location cache:', error);
    }
    return null;
  },

  setCachedLocation: async (location: any): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        [CACHE_KEYS.LOCATION, JSON.stringify(location)],
        [CACHE_KEYS.LOCATION_TIMESTAMP, Date.now().toString()]
      ]);
      console.log('💾 Location cached successfully');
    } catch (error) {
      console.error('❌ Error caching location:', error);
    }
  },
};

// Initialize API Key on app start
export const initializeApiKey = async (): Promise<void> => {
  try {
    // Check if API key already exists
    const existingApiKey = await KeychainService.getApiKey();
    
    if (!existingApiKey) {
      // Save static API key to Keychain
      const staticApiKey = 'API_KEY_SECRET_XYZ_12345_' + Date.now();
      await KeychainService.saveApiKey(staticApiKey);
      console.log('🔐 Static API key initialized in Keychain');
    } else {
      console.log('🔐 API key already exists in Keychain');
    }
  } catch (error) {
    console.error('❌ Error initializing API key:', error);
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get API Key from Keychain for every request
      const apiKey = await KeychainService.getApiKey();
      
      if (!apiKey) {
        console.error('❌ API Key not found in Keychain');
        throw new Error('UNAUTHORIZED: API Key missing');
      }

      // Add API Key to headers
      config.headers['X-API-Key'] = apiKey;
      config.headers['X-Client-Platform'] = 'React-Native';
      
      // Add auth token if available
      const authToken = await KeychainService.getAuthToken();
      if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      console.log('🚀 API Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasApiKey: !!apiKey,
        hasAuthToken: !!authToken,
      });
      
      return config;
    } catch (error: any) {
      console.error('❌ Request interceptor error:', error);
      
      // Handle API Key not found
      if (error.message?.includes('UNAUTHORIZED') || error.message?.includes('ACCESS_DENIED')) {
        // Stop the request and show error
        Alert.alert(
          'Authentication Error',
          'Unable to access secure credentials. Please restart the app.',
          [{ text: 'OK' }]
        );
        return Promise.reject({
          ...error,
          userMessage: 'Secure storage access failed. Please restart the app.',
        });
      }
      
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('❌ Request interceptor setup error:', error);
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
  // Initialize API Key
  initializeApiKey,
  
  login: (credentials: { username: string; password: string; expiresInMins?: number }) => 
    apiClient.post('/auth/login', credentials),
  
  getProducts: (limit: number = 30, skip: number = 0) =>
    apiClient.get(`/products?limit=${limit}&skip=${skip}`),
  
  getProduct: (id: string | number) =>
    apiClient.get(`/products/${id}`),
  
  getProductsByCategory: async (category: string) => {
    try {
      // Cache-first strategy for categories
      const cachedCategories = await cacheUtils.getCachedCategories();
      if (cachedCategories) {
        console.log('📦 Returning cached categories data');
        return { data: cachedCategories };
      }
      
      console.log('🌐 Fetching categories from API');
      const response = await apiClient.get(`/products/category/${category}`);
      
      // Cache the categories
      let productsToCache: any[] = [];
      if (response.data && response.data.products) {
        productsToCache = response.data.products;
      } else if (Array.isArray(response.data)) {
        productsToCache = response.data;
      }
      
      if (productsToCache.length > 0) {
        await cacheUtils.setCachedCategories(productsToCache);
      }
      
      return response;
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  },
  
  searchProducts: (query: string) =>
    apiClient.get(`/products/search?q=${encodeURIComponent(query)}`),
  
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

  // Upload methods
  uploadFile: async (fileData: FormData, onProgress?: (progress: number) => void) => {
    try {
      const response = await apiClient.post('/upload', fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onProgress(Math.round(progress));
          }
        },
        timeout: 30000, // 30 second timeout untuk upload
      });

      return response;
    } catch (error: any) {
      console.error('Upload error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Upload timeout - please check your connection');
      }
      
      throw error;
    }
  },

  // Upload KTP khusus
  uploadKTP: async (formData: FormData) => {
    return apiMethods.uploadFile(formData);
  },

  /**
   * 4. Integrasi Networking Hemat Data
   * Kirim lokasi user ke server untuk analitik
   * Menggunakan maximumAge: 120000 (2 menit) di LocationService
   * Ini membantu mengurangi beban server dan baterai dengan tidak 
   * mengambil data GPS baru jika data lama masih segar (di bawah 2 menit)
   */
  sendLocationAnalytics: async (locationData: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: number;
  }) => {
    try {
      // Cek cache lokasi terlebih dahulu untuk menghindari spam
      const cachedLocation = await cacheUtils.getCachedLocation();
      if (cachedLocation && 
          cachedLocation.latitude === locationData.latitude && 
          cachedLocation.longitude === locationData.longitude) {
        console.log('📍 Lokasi sama dengan cache, skip pengiriman');
        return { data: { success: true, cached: true } };
      }

      // Simpan ke cache
      await cacheUtils.setCachedLocation(locationData);

      const response = await apiClient.post('/analytics/location', {
        ...locationData,
        deviceId: 'react-native-ecommerce-app',
        sessionId: Date.now().toString(),
        source: 'location_tracking',
      });

      console.log('📍 Lokasi analitik terkirim ke server');
      return response;
    } catch (error) {
      console.warn('⚠️ Gagal mengirim lokasi analitik:', error);
      // Jangan throw error untuk analitik, karena tidak kritis
      return { data: { success: false, error: 'Failed to send analytics' } };
    }
  },

  // Method untuk menghitung ongkir berdasarkan lokasi
  calculateShippingCost: async (userLocation: {
    latitude: number;
    longitude: number;
  }, storeLocation: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const response = await apiClient.post('/shipping/calculate', {
        userLocation,
        storeLocation,
        calculationTime: new Date().toISOString(),
        serviceType: 'regular',
      });

      return response;
    } catch (error) {
      console.error('Error calculating shipping cost:', error);
      
      // Fallback untuk demo
      const distance = Math.sqrt(
        Math.pow(userLocation.latitude - storeLocation.latitude, 2) +
        Math.pow(userLocation.longitude - storeLocation.longitude, 2)
      ) * 111; // Convert ke km

      const cost = Math.max(10000, Math.min(50000, distance * 2000));
      
      return {
        data: {
          success: true,
          cost: Math.round(cost),
          estimatedTime: '1-2 hari',
          distance: distance.toFixed(1) + ' km',
          note: 'Demo calculation'
        }
      };
    }
  },

  // Method untuk mendapatkan toko terdekat
  getNearbyStores: async (userLocation: {
    latitude: number;
    longitude: number;
  }, radius: number = 5000) => {
    try {
      const response = await apiClient.get('/stores/nearby', {
        params: {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
          radius,
          limit: 20,
        },
      });

      return response;
    } catch (error) {
      console.error('Error getting nearby stores:', error);
      
      // Fallback data untuk demo
      const mockStores = [
        {
          id: '1',
          name: 'Toko Utama Monas',
          address: 'Jl. Merdeka No. 123, Jakarta',
          distance: 1.2,
          latitude: -6.1754,
          longitude: 106.8272,
          isOpen: true,
          rating: 4.5,
        },
        {
          id: '2',
          name: 'Toko Cabang Senayan',
          address: 'Jl. Senayan Raya No. 45, Jakarta',
          distance: 3.5,
          latitude: -6.2275,
          longitude: 106.8004,
          isOpen: true,
          rating: 4.2,
        },
      ];

      return {
        data: mockStores,
        success: true,
        message: 'Demo stores data'
      };
    }
  },

  // Method untuk tracking kurir
  updateCourierLocation: async (courierId: string, location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  }) => {
    try {
      const response = await apiClient.post(`/couriers/${courierId}/location`, {
        ...location,
        timestamp: new Date().toISOString(),
        batteryLevel: 85, // Contoh data tambahan
      });

      return response;
    } catch (error) {
      console.error('Error updating courier location:', error);
      throw error;
    }
  },

  // Method untuk geofencing promo
  checkStoreProximity: async (userLocation: {
    latitude: number;
    longitude: number;
  }, storeId: string) => {
    try {
      const response = await apiClient.post('/promotions/check-proximity', {
        userLocation,
        storeId,
        maxDistance: 100, // 100 meter
      });

      return response;
    } catch (error) {
      console.error('Error checking store proximity:', error);
      
      // Fallback untuk demo
      return {
        data: {
          inRange: true,
          distance: 75.5,
          promotion: {
            id: 'promo1',
            title: 'Diskon Spesial 20%',
            description: 'Khusus pengunjung di sekitar toko',
            validUntil: '2024-12-31'
          }
        }
      };
    }
  },

  // Cache management methods
  cacheUtils,
};

export default apiClient;