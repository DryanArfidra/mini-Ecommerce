import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NetworkStatusProvider } from './src/context/NetworkStatusContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeApiKey } from './src/services/apiClient';

// Enhanced Deep Linking Configuration
const linking = {
  prefixes: ['miniecom://', 'ecommerceapp://', 'https://yourapp.com'],
  config: {
    screens: {
      Main: {
        screens: {
          HomeStack: {
            screens: {
              Home: 'home',
            }
          },
          ProductsStack: {
            screens: {
              ProductList: 'produk',
              ProductDetail: 'produk/:id',
            }
          },
          Profile: 'profil/:userId',
          Cart: 'keranjang',
        }
      },
      Login: 'login',
      // Add direct routes for deep linking
      ProductDetail: 'product/:id',
      Cart: 'cart',
      Checkout: 'checkout',
    },
  },
};

const App: React.FC = () => {
  const [appKey, setAppKey] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('🚀 Initializing app security...');
        await initializeApiKey();
        console.log('✅ App security initialized');
      } catch (error) {
        console.error('❌ App security initialization failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initApp();
  }, []);

  const handleAppReset = () => {
    setAppKey(prev => prev + 1);
  };

  if (isInitializing) {
    return null;
  }

  return (
    <ErrorBoundary onReset={handleAppReset}>
      <SafeAreaProvider>
        <NetworkStatusProvider>
          <AuthProvider>
            <AppNavigator key={appKey} linking={linking} />
          </AuthProvider>
        </NetworkStatusProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;