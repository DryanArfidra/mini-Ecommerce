import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export const useDrawerLock = () => {
  const [drawerLocked, setDrawerLocked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      swipeEnabled: !drawerLocked,
    });
  }, [drawerLocked, navigation]);

  return {
    drawerLocked,
    setDrawerLocked,
  };
};

export default useDrawerLock;