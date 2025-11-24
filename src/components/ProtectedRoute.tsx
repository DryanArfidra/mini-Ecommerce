import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import TokenUtils from '../utils/tokenUtils';
import KeychainService from '../services/KeychainService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackComponent 
}) => {
  const { isAuthenticated, logout, forceLogout } = useAuth();
  const navigation = useNavigation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    checkTokenValidity();
    
    // Add biometric lockout listener
    const checkBiometricLockout = async () => {
      try {
        // This is a proactive check for biometric lockout
        const sensorInfo = await KeychainService.isSensorAvailable();
        if (!sensorInfo.available && sensorInfo.error?.includes('LOCKOUT')) {
          await handleBiometricLockout();
        }
      } catch (error) {
        console.error('❌ Error checking biometric status:', error);
      }
    };
    
    checkBiometricLockout();
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
    } catch (error: any) {
      console.error('❌ Error checking token validity:', error);
      
      // Handle security-related errors
      if (error.message?.includes('ACCESS_DENIED') || error.message?.includes('BIOMETRY_LOCKOUT')) {
        await handleSecurityIncident(error.message);
      }
    } finally {
      setIsCheckingToken(false);
    }
  };

  const handleSecurityIncident = async (reason: string) => {
    console.log('🚨 Security incident detected in ProtectedRoute:', reason);
    
    try {
      await forceLogout(`Security incident: ${reason}`);
      
      // Navigate to login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    } catch (error) {
      console.error('❌ Error handling security incident:', error);
    }
  };

  const handleBiometricLockout = async () => {
    console.log('🚨 Biometric lockout detected in ProtectedRoute');
    
    Alert.alert(
      'Keamanan Diperlukan',
      'Terlalu banyak percobaan biometrik gagal. Untuk keamanan, Anda akan logout otomatis.',
      [
        {
          text: 'OK',
          onPress: async () => {
            await handleSecurityIncident('BIOMETRY_LOCKOUT');
          }
        }
      ]
    );
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