import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AddProductScreen from '../screens/AddProductScreen';

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  Checkout: { productId: string };
  AddProduct: undefined;
};

const Stack = createNativeStackNavigator<ProductStackParamList>();

const ProductStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={({ navigation }: any) => ({
          title: 'All Products',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{
          title: 'Tambah Produk',
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductStackNavigator;