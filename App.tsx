import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NetworkStatusProvider } from './src/context/NetworkStatusContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { initializeApiKey } from './src/services/apiClient';

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
    return null; // Or a splash screen
  }

  return (
    <ErrorBoundary onReset={handleAppReset}>
      <SafeAreaProvider>
        <NetworkStatusProvider>
          <AuthProvider>
            <AppNavigator key={appKey} />
          </AuthProvider>
        </NetworkStatusProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;