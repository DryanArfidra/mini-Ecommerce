import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native'; // Import dari react-native
import HomeStackNavigator from './HomeStackNavigator';
import ProductListScreen from '../screens/ProductListScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  HomeStack: undefined;
  Products: undefined;
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
    // HAPUS edges property - tidak compatible dengan versi lama
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#f0f0f0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 4,
          },
        }}
      >
        <Tab.Screen 
          name="HomeStack" 
          component={HomeStackNavigator}
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