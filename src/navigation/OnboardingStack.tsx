import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
import LoginScreen from '../screens/LoginScreen';

export type OnboardingStackParamList = {
  Onboarding1: undefined;
  Onboarding2: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
      <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
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
    </Stack.Navigator>
  );
};

export default OnboardingStack;