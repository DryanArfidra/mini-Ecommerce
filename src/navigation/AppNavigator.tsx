import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import OnboardingStack from './OnboardingStack';
import DrawerNavigator from './DrawerNavigator';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isOnboardingCompleted } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        {!isOnboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : null}
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: true,
            title: 'Login',
            headerStyle: {
              backgroundColor: '#2196F3',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;