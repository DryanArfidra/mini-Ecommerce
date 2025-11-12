import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../types/types';

type SettingsScreenNavigationProp = DrawerNavigationProp<DrawerParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const isFocused = useIsFocused();
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          swipeEnabled: isSwipeEnabled,
        });
      }
    }
  }, [isFocused, isSwipeEnabled, navigation]);

  const handleGoHomeAndCloseDrawer = () => {
    navigation.navigate('Home');
    const parent = navigation.getParent();
    if (parent && 'closeDrawer' in parent) {
      (parent as any).closeDrawer();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaturan Navigasi</Text>
      <View style={styles.settingItem}>
        <Text style={styles.label}>Aktifkan Swipe Drawer</Text>
        <Switch value={isSwipeEnabled} onValueChange={setIsSwipeEnabled} />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleGoHomeAndCloseDrawer}>
        <Text style={styles.buttonText}>Pergi ke Home & Tutup Drawer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: { fontSize: 16 },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SettingsScreen;
