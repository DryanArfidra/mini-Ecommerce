import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeTabsNavigator from '../navigation/HomeTabsNavigator';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <HomeTabsNavigator />
    </SafeAreaView>
  );
};

export default HomeScreen;