import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native'; // Import Text dari react-native
import HomeTabsNavigator from './HomeTabsNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';

export type HomeStackParamList = {
  HomeTabs: undefined;
  ProductDetail: { productId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="HomeTabs" 
        component={HomeTabsNavigator}
        options={{
          title: 'Mini E-Commerce',
          headerRight: () => (
            <Text style={{ color: 'white', marginRight: 15 }}>🏠</Text>
          ),
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          title: 'Detail Produk',
          headerBackTitle: 'Kembali',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;