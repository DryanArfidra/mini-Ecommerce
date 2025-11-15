// App.tsx
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NetworkStatusProvider } from './src/context/NetworkStatusContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

const App: React.FC = () => {
  const [appKey, setAppKey] = useState(0);

  const handleAppReset = () => {
    // Force re-render by changing the key
    setAppKey(prev => prev + 1);
  };

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