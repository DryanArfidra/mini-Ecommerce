import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './HomeScreen';

interface HomeWrapperScreenProps {
  navigation: any;
}

const HomeWrapperScreen: React.FC<HomeWrapperScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <HomeScreen navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeWrapperScreen;