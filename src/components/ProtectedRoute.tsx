import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import TokenUtils from '../utils/tokenUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackComponent 
}) => {
  const { isAuthenticated, logout } = useAuth();
  const navigation = useNavigation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const checkTokenValidity = async () => {
    try {
      const validToken = await TokenUtils.getValidToken();
      
      if (!validToken) {
        console.log('🚫 No valid token found, redirecting to login');
        await logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' as never }],
        });
      }
    } catch (error) {
      console.error('❌ Error checking token validity:', error);
    } finally {
      setIsCheckingToken(false);
    }
  };

  if (isCheckingToken) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    // Default fallback - redirect handled by useEffect
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Redirecting to login...</Text>
      </View>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;