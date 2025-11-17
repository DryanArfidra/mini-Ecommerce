import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for AsyncStorage
const AUTH_KEYS = {
  TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  NOTIFICATION: 'notification_status',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Multi-key load saat app pertama kali dibuka
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🚀 Loading initial data with multiGet...');
      
      // MultiGet untuk load semua data penting sekaligus
      const keys = [AUTH_KEYS.TOKEN, AUTH_KEYS.USER_DATA, AUTH_KEYS.THEME, AUTH_KEYS.NOTIFICATION];
      const values = await AsyncStorage.multiGet(keys);
      
      const [
        [, token],
        [, userData],
        [, theme],
        [, notificationStatus]
      ] = values;

      console.log('📦 MultiGet results:', {
        token: token ? 'exists' : 'null',
        userData: userData ? 'exists' : 'null',
        theme: theme || 'default',
        notification: notificationStatus || 'default'
      });

      // Cek token dan user data
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
          console.log('✅ Auto-login successful');
        } catch (parseError) {
          console.error('❌ Error parsing user data:', parseError);
          await clearAuthData();
        }
      }

    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    try {
      const keys = [AUTH_KEYS.TOKEN, AUTH_KEYS.USER_DATA];
      await AsyncStorage.multiRemove(keys);
      console.log('🧹 Auth data cleared');
    } catch (error) {
      console.error('❌ Error clearing auth data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (email && password) {
          const userData: User = {
            id: 'U123', 
            name: 'Dryan Arfidra',
            email: email,
            avatar: 'https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg'
          };
          
          try {
            // Simpan token dan user data ke AsyncStorage
            const token = `token_${Date.now()}`;
            await AsyncStorage.multiSet([
              [AUTH_KEYS.TOKEN, token],
              [AUTH_KEYS.USER_DATA, JSON.stringify(userData)]
            ]);
            
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Login successful, data saved to storage');
            resolve(true);
          } catch (error) {
            console.error('❌ Error saving login data:', error);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 Logging out...');
      
      // MultiRemove untuk hapus semua data sensitif sekaligus
      const keysToRemove = [AUTH_KEYS.TOKEN, AUTH_KEYS.USER_DATA];
      await AsyncStorage.multiRemove(keysToRemove);
      
      console.log('✅ All auth data removed successfully');
      
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Fallback: clear state even if storage fails
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const completeOnboarding = () => setIsOnboardingCompleted(true);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isOnboardingCompleted,
      user,
      login,
      logout,
      completeOnboarding,
      isLoading,
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