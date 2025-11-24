import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiMethods } from '../services/apiClient';
import KeychainService, { KeychainServices } from '../services/KeychainService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AppPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  user: User | null;
  preferences: AppPreferences;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  forceLogout: (reason?: string) => Promise<void>; // NEW: Force logout for security
  completeOnboarding: () => void;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<AppPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for AsyncStorage (non-sensitive data)
const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  NOTIFICATION: 'notification_status',
  LANGUAGE: 'app_language',
  ONBOARDING: 'onboarding_completed',
} as const;

// Default preferences
const defaultPreferences: AppPreferences = {
  theme: 'light',
  notifications: true,
  language: 'id',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Hybrid Storage Load - Load both secure and non-sensitive data in parallel
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🚀 Loading initial data with Hybrid Storage...');
      
      // Load both secure (Keychain) and non-sensitive (AsyncStorage) data in parallel
      const [tokenResult, storageData] = await Promise.allSettled([
        // Secure data from Keychain
        KeychainService.getAuthToken(),
        
        // Non-sensitive data from AsyncStorage
        AsyncStorage.multiGet([
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.THEME,
          STORAGE_KEYS.NOTIFICATION,
          STORAGE_KEYS.LANGUAGE,
          STORAGE_KEYS.ONBOARDING,
        ]),
      ]);

      // Handle secure data (token) result
      let token: string | null = null;
      if (tokenResult.status === 'fulfilled') {
        token = tokenResult.value;
      } else {
        console.error('❌ Error loading token from Keychain:', tokenResult.reason);
        
        // Handle access denied specifically
        if (tokenResult.reason.message?.includes('ACCESS_DENIED')) {
          Alert.alert(
            'Keamanan Perubahan Perangkat',
            'Keamanan perangkat diubah, mohon login ulang.',
            [{ text: 'OK' }]
          );
          await handleSecurityBreach();
          return;
        }
      }

      // Handle non-sensitive data result
      let userData: User | null = null;
      let loadedPreferences: AppPreferences = { ...defaultPreferences };
      let onboardingCompleted = true;

      if (storageData.status === 'fulfilled') {
        const [
          [, userDataJson],
          [, theme],
          [, notifications],
          [, language],
          [, onboarding],
        ] = storageData.value;

        // Parse user data
        if (userDataJson) {
          try {
            userData = JSON.parse(userDataJson);
          } catch (parseError) {
            console.error('❌ Error parsing user data:', parseError);
          }
        }

        // Load preferences
        loadedPreferences = {
          theme: (theme as AppPreferences['theme']) || defaultPreferences.theme,
          notifications: notifications ? JSON.parse(notifications) : defaultPreferences.notifications,
          language: language || defaultPreferences.language,
        };

        onboardingCompleted = onboarding ? JSON.parse(onboarding) : true;
      } else {
        console.error('❌ Error loading storage data:', storageData.reason);
      }

      console.log('📦 Hybrid Storage results:', {
        token: token ? 'exists' : 'null',
        userData: userData ? 'exists' : 'null',
        preferences: loadedPreferences,
        onboardingCompleted,
      });

      // Set authentication state
      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Auto-login successful from secure storage');
      }

      setPreferences(loadedPreferences);
      setIsOnboardingCompleted(onboardingCompleted);

    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityBreach = async () => {
    try {
      // Clean all secure data due to security breach
      await Promise.allSettled([
        KeychainService.cleanAllSecureData(),
        AsyncStorage.multiRemove([
          STORAGE_KEYS.USER_DATA,
          STORAGE_KEYS.THEME,
          STORAGE_KEYS.NOTIFICATION,
          STORAGE_KEYS.LANGUAGE,
        ]),
      ]);
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setPreferences(defaultPreferences);
    } catch (cleanupError) {
      console.error('❌ Error during security breach cleanup:', cleanupError);
    }
  };

  // NEW: Force logout for security incidents
  const forceLogout = async (reason: string = 'Security incident detected'): Promise<void> => {
    try {
      console.log('🚨 FORCE LOGOUT:', reason);
      
      // Clean all secure data FIRST (most important)
      await KeychainService.cleanAllSecureData();
      
      // Then clean non-sensitive data
      const keysToRemove = [
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.NOTIFICATION,
        STORAGE_KEYS.LANGUAGE,
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      
      console.log('✅ All data removed during force logout');
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Show security alert
      Alert.alert(
        'Keamanan Diperlukan',
        `Untuk keamanan akun Anda, kami telah melakukan logout otomatis. Alasan: ${reason}`,
        [{ text: 'Mengerti' }]
      );
      
    } catch (error) {
      console.error('❌ Error during force logout:', error);
      
      // Even if storage cleanup fails, reset state
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const updatePreferences = async (newPreferences: Partial<AppPreferences>): Promise<void> => {
    try {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      // Save to AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.THEME, updatedPreferences.theme],
        [STORAGE_KEYS.NOTIFICATION, JSON.stringify(updatedPreferences.notifications)],
        [STORAGE_KEYS.LANGUAGE, updatedPreferences.language],
      ]);

      console.log('✅ Preferences updated and saved');
    } catch (error) {
      console.error('❌ Error updating preferences:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login with API...');
      
      const response = await apiMethods.login({ username, password });
      const data = response.data;
      
      if (data.success && data.token) {
        // Create user data from API response
        const userData: User = {
          id: data.user?.id?.toString() || 'U123',
          name: data.user?.firstName + ' ' + data.user?.lastName || 'Demo User',
          email: data.user?.email || `${username}@demo.com`,
          avatar: data.user?.image || 'https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg'
        };
        
        // Save token to Keychain (secure storage)
        await KeychainService.saveAuthToken(data.token);
        
        // Save user data to AsyncStorage (non-sensitive)
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ Login successful, secure token saved to Keychain');
        return true;
      } else {
        console.log('❌ Login failed - no token received');
        return false;
      }
      
    } catch (error: any) {
      console.error('❌ Login API error:', error.message);
      
      // Fallback to mock login for development
      console.log('🔄 Using fallback mock login...');
      return await mockLogin(username, password);
    }
  };

  const mockLogin = async (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const validCredentials = [
          { username: 'kminchelle', password: '0lelplR' },
          { username: 'emilys', password: 'emilyspass' },
          { username: 'atuny0', password: '9uQFF1Lh' },
          { username: 'demo', password: 'demo' }
        ];

        const isValid = validCredentials.some(
          cred => cred.username === username && cred.password === password
        );

        if (isValid) {
          const userData: User = {
            id: 'U123', 
            name: username === 'kminchelle' ? 'Dryan Arfidra' : 
                  username === 'emilys' ? 'Emily Johnson' : 
                  username === 'atuny0' ? 'Tony Stark' : 'Demo User',
            email: `${username}@demo.com`,
            avatar: 'https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg'
          };
          
          try {
            const mockToken = `mock_token_${Date.now()}`;
            
            // Save to Keychain
            await KeychainService.saveAuthToken(mockToken);
            
            // Save to AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Mock login successful, token saved to Keychain');
            resolve(true);
          } catch (error) {
            console.error('❌ Error saving mock login data:', error);
            resolve(false);
          }
        } else {
          console.log('❌ Invalid credentials in mock login');
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Starting secure logout...');
      
      // Clean secure data from Keychain FIRST
      await KeychainService.cleanAllSecureData();
      
      // Then clean non-sensitive data from AsyncStorage
      const keysToRemove = [
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.THEME,
        STORAGE_KEYS.NOTIFICATION,
        STORAGE_KEYS.LANGUAGE,
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      
      console.log('✅ All data removed from secure and non-secure storage');
      
      // Reset state only after storage is cleared
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('❌ Error during secure logout:', error);
      
      // Fallback: clear state even if storage cleanup fails
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    setIsOnboardingCompleted(true);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isOnboardingCompleted,
      user,
      preferences,
      login,
      logout,
      forceLogout, // NEW: Include forceLogout in context
      completeOnboarding,
      isLoading,
      updatePreferences,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};