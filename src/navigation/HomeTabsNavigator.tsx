import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PopularScreen from '../screens/tabs/PopularScreen';
import NewestScreen from '../screens/tabs/NewestScreen';
import DiscountScreen from '../screens/tabs/DiscountScreen';
import ElektronikScreen from '../screens/tabs/ElektronikScreen';
import FashionScreen from '../screens/tabs/FashionScreen';
import FoodScreen from '../screens/tabs/FoodScreen';
import AutomotiveScreen from '../screens/tabs/AutomotiveScreen';
import BabyGearScreen from '../screens/tabs/BabyGearScreen';

export type HomeTabsParamList = {
  Populer: undefined;
  Terbaru: undefined;
  Diskon: undefined;
  Elektronik: undefined;
  Pakaian: undefined;
  Makanan: undefined;
  Otomotif: undefined;
  'Perlengkapan Bayi': undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>();

const HomeTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarItemStyle: { 
          width: 'auto',
          paddingHorizontal: 12,
        },
        tabBarLabelStyle: { 
          fontSize: 13,
          fontWeight: '600',
          textTransform: 'none',
        },
        tabBarStyle: { 
          backgroundColor: 'white',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#2196F3',
          height: 3,
        },
        lazy: true, // ✅ LAZY LOADING
        lazyPreloadDistance: 1, // ✅ PRELOAD TAB BERDEKATAN
      }}
    >
      <Tab.Screen name="Populer" component={PopularScreen} />
      <Tab.Screen name="Terbaru" component={NewestScreen} />
      <Tab.Screen name="Diskon" component={DiscountScreen} />
      <Tab.Screen name="Elektronik" component={ElektronikScreen} />
      <Tab.Screen name="Pakaian" component={FashionScreen} />
      <Tab.Screen name="Makanan" component={FoodScreen} />
      <Tab.Screen name="Otomotif" component={AutomotiveScreen} />
      <Tab.Screen 
        name="Perlengkapan Bayi" 
        component={BabyGearScreen}
        options={{
          title: 'Perlengkapan Bayi',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabsNavigator;