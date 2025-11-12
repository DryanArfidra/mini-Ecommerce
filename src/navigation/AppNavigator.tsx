import React, { useState, useEffect } from 'react';
import OnboardingStack from './OnboardingStack';
import MainTabNavigator from './MainTabNavigator';

const AppNavigator = () => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  // Di aplikasi nyata, Anda akan menyimpan status ini di AsyncStorage
  // useEffect(() => {
  //   const checkOnboardingStatus = async () => {
  //     const status = await AsyncStorage.getItem('isOnboardingComplete');
  //     if (status === 'true') {
  //       setIsOnboardingComplete(true);
  //     }
  //   };
  //   checkOnboardingStatus();
  // }, []);

  if (isOnboardingComplete) {
    return <MainTabNavigator />;
  }

  return <OnboardingStack onComplete={() => setIsOnboardingComplete(true)} />;
};

export default AppNavigator;