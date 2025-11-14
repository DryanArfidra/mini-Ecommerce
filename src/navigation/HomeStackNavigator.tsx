import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import HomeTabsNavigator from './HomeTabsNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AddProductScreen from '../screens/AddProductScreen'; 

export type HomeStackParamList = {
  HomeTabs: undefined;
  ProductDetail: { productId: string };
  Checkout: { productId: string };
  AddProduct: undefined; // ✅ TAMBAH ROUTE BARU
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1d95f8ff',
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
          title: 'Jelajahi Produk',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 15 }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>☰   </Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddProduct')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>🧺</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          title: 'Detail Produk',
          headerBackTitle: 'Kembali',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{
          title: 'Tambah Produk',
          headerBackTitle: 'Kembali',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;