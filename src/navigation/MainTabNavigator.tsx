import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import ProductStackNavigator from './ProductStackNavigator'; 
import ProfileScreen from '../screens/ProfileScreen';
import CartScreen from '../screens/CartScreen';

export type MainTabParamList = {
  HomeStack: undefined;
  ProductsStack: undefined; 
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ focused, icon, label }: { focused: boolean; icon: string; label: string }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
    <Text style={{ fontSize: 22, color: focused ? '#2196F3' : '#666', marginBottom: 2 }}>
      {icon}
    </Text>
    <Text style={{ 
      fontSize: 12, 
      fontWeight: '500', 
      color: focused ? '#2196F3' : '#666' 
    }}>
      {label}
    </Text>
  </View>
);

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 75,
          paddingBottom: 8,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen 
        name="HomeStack" 
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏠" label="Home" />
          ),
        }}
      />
      <Tab.Screen 
        name="ProductsStack" 
        component={ProductStackNavigator} 
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🛍️" label="Products" />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🛒" label="Cart" />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;