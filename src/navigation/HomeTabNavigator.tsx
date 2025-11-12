import React from 'react';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';

import PopularScreen from '../screens/tabs/PopularScreen';
import NewestScreen from '../screens/tabs/NewestScreen';
import DiscountScreen from '../screens/tabs/DiscountScreen';
import ElektronikScreen from '../screens/tabs/ElektronikScreen';
import FashionScreen from '../screens/tabs/FashionScreen';
import FoodScreen from '../screens/tabs/FoodScreen';
import AutomotiveScreen from '../screens/tabs/AutomotiveScreen';
import EntertainmentScreen from '../screens/tabs/EntertainmentScreen';
import BabyGearScreen from '../screens/tabs/BabyGearScreen';

export type HomeTabParamList = {
  Populer: undefined;
  Terbaru: undefined;
  Diskon: undefined;
  Elektronik: undefined;
  Pakaian: undefined;
  Makanan: undefined;
  Otomotif: undefined;
  Hiburan: undefined;
  'Perlengkapan Bayi': undefined;
};

const Tab = createMaterialTopTabNavigator<HomeTabParamList>();

const HomeTabNavigator = () => {
  const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    tabBarActiveTintColor: '#007bff',
    tabBarLabelStyle: { textTransform: 'none', fontSize: 12 },
    tabBarIndicatorStyle: { backgroundColor: '#007bff', height: 3 },
    tabBarStyle: { backgroundColor: '#ffffff' },
    tabBarScrollEnabled: true,
  };

  const children = (
    <>
      <Tab.Screen name="Populer" component={PopularScreen} />
      <Tab.Screen name="Terbaru" component={NewestScreen} />
      <Tab.Screen name="Diskon" component={DiscountScreen} />
      <Tab.Screen name="Elektronik" component={ElektronikScreen} />
      <Tab.Screen name="Pakaian" component={FashionScreen} />
      <Tab.Screen name="Makanan" component={FoodScreen} />
      <Tab.Screen name="Otomotif" component={AutomotiveScreen} />
      <Tab.Screen name="Hiburan" component={EntertainmentScreen} />
      <Tab.Screen name="Perlengkapan Bayi" component={BabyGearScreen} />
    </>
  );

  return (
    <Tab.Navigator screenOptions={screenOptions} children={children} />
  );
};

export default HomeTabNavigator;
