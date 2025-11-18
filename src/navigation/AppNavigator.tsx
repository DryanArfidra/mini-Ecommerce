import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';
import OnboardingStack from './OnboardingStack';
import { ActivityIndicator, View, Text } from 'react-native';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Onboarding: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboardingCompleted ? (
          // Show onboarding if not completed
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : !isAuthenticated ? (
          // Show login if onboarding completed but not authenticated
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
          // Show main app if authenticated
          <Stack.Screen name="Main" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;