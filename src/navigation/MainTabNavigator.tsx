import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native'; // ← IMPORT DARI REACT-NATIVE
import HomeScreen from '../screens/HomeScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  Home: undefined;
  Products: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Simple Tab Icon Component
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }} edges={['top']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            height: 70,
            paddingBottom: 10,
            paddingTop: 6,
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon="🏠" label="" />
            ),
          }}
        />
        <Tab.Screen 
          name="Products" 
          component={ProductListScreen}
          options={{
            tabBarLabel: 'Products',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon="🛍️" label="" />
            ),
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon="👤" label="" />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default MainTabNavigator;