import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import OnboardingStack from './OnboardingStack';
import { ActivityIndicator, View, Text } from 'react-native';

// UNIFIED Root Stack Param List - Semua screen didefinisikan di sini
export type RootStackParamList = {
  Main: undefined;
  Login: { callback?: string } | undefined;
  Onboarding: undefined;
  // Direct screens untuk deep linking
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: { productId?: string };
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
  linking?: LinkingOptions<RootStackParamList>;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({ linking }) => {
  const { isAuthenticated, isOnboardingCompleted, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10 }}>Loading secure credentials...</Text>
      </View>
    );
  }

  console.log('🔄 AppNavigator State:', {
    isAuthenticated,
    isOnboardingCompleted,
    isLoading
  });

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : !isAuthenticated ? (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
              headerShown: true,
              title: 'Login',
              headerStyle: { backgroundColor: '#2196F3' },
              headerTintColor: 'white',
            }}
          />
        ) : (
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;