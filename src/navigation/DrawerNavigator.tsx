import React, { useState, createContext, useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type DrawerParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Settings: undefined;
};

type DrawerLockContextType = {
  drawerLocked: boolean;
  setDrawerLocked: (locked: boolean) => void;
};

export const DrawerLockContext = createContext<DrawerLockContextType>({
  drawerLocked: true,
  setDrawerLocked: () => {},
});

export const useDrawerLock = () => useContext(DrawerLockContext);

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  const [drawerLocked, setDrawerLocked] = useState(true); // Default locked

  return (
    <DrawerLockContext.Provider value={{ drawerLocked, setDrawerLocked }}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '80%',
          },
          swipeEnabled: !drawerLocked, // ← Kontrol swipe gesture
        }}
      >
        <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </DrawerLockContext.Provider>
  );
};

export default DrawerNavigator;