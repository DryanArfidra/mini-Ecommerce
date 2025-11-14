import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import HomeTabsNavigator from './HomeTabsNavigator'; // Level 4
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
        options={({ navigation }: any) => ({
          title: 'Mini E-Commerce',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>☰</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Text style={{ color: 'white', marginRight: 15, fontSize: 20 }}>🏠</Text>
          ),
        })}
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