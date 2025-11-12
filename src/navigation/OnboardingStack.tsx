import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
const Stack = createStackNavigator();

interface OnboardingStackProps {
  onComplete: () => void;
}

const OnboardingStack: React.FC<OnboardingStackProps> = ({ onComplete }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding1">
        {(props) => <OnboardingScreen1 {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding2">
        {(props) => <OnboardingScreen2 {...props} onComplete={onComplete} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default OnboardingStack;