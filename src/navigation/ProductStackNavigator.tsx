import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, TouchableOpacity } from 'react-native';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AddProductScreen from '../screens/AddProductScreen';

export type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { 
    productId: string;
    productTitle?: string; 
  };
  Checkout: { productId: string };
  AddProduct: undefined;
};

const Stack = createNativeStackNavigator<ProductStackParamList>();

const ProductStackNavigator: React.FC = () => {
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
        name="ProductList" 
        component={ProductListScreen}
        options={({ navigation }: any) => ({
          title: 'All Products',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('AddProduct')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>➕</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={({ route }: any) => ({
          title: route.params?.productTitle || 'Product Details',
        })}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          title: 'Checkout',
        }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{
          title: 'Tambah Produk',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductStackNavigator;