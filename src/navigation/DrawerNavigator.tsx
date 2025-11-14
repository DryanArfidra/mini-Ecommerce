import React, { useState, createContext, useContext, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigationState } from '@react-navigation/native';
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
  drawerLocked: false,
  setDrawerLocked: () => {},
});

export const useDrawerLock = () => useContext(DrawerLockContext);

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  const [drawerLocked, setDrawerLocked] = useState(false);
  
  // ✅ DETEKSI RUTE AKTIF UNTUK CONDITIONAL LOCK
  const navigationState = useNavigationState(state => state);
  
  useEffect(() => {
    const currentRoute = navigationState?.routes[navigationState.index];
    const currentScreen = currentRoute?.state?.routes?.[0]?.name || currentRoute?.name;
    
    // ✅ LOCK DRAWER PADA SCREEN TERTENTU
    const lockedScreens = ['ProductDetail', 'Checkout'];
    const shouldLock = lockedScreens.includes(currentScreen);
    
    setDrawerLocked(shouldLock);
    
    console.log(`[DRAWER LOCK] Screen: ${currentScreen}, Locked: ${shouldLock}`);
  }, [navigationState]);

  return (
    <DrawerLockContext.Provider value={{ drawerLocked, setDrawerLocked }}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: '80%',
          },
          swipeEnabled: !drawerLocked, // ✅ CONDITIONAL SWIPE - HAPUS drawerLockMode
        }}
      >
        <Drawer.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{
            swipeEnabled: !drawerLocked, // ✅ SET PER SCREEN JUGA
          }}
        />
        <Drawer.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{
            swipeEnabled: !drawerLocked,
          }}
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            swipeEnabled: !drawerLocked,
          }}
        />
      </Drawer.Navigator>
    </DrawerLockContext.Provider>
  );
};

export default DrawerNavigator;