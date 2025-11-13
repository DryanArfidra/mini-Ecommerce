import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useDrawerLock } from '../navigation/DrawerNavigator';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const { drawerLocked, setDrawerLocked } = useDrawerLock();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleUnlockDrawer = () => {
    setDrawerLocked(false);
    Alert.alert('Berhasil', 'Swipe gesture drawer telah diaktifkan');
  };

  const handleLockDrawer = () => {
    setDrawerLocked(true);
    Alert.alert('Berhasil', 'Swipe gesture drawer telah dinonaktifkan');
  };

  const handleNavigateHome = () => {
    navigation.navigate('MainTabs' as never);
    // Tutup drawer secara programatik
    navigation.dispatch({ type: 'CLOSE_DRAWER' } as never);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigasi Drawer</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Swipe Gesture Drawer</Text>
            <Text style={styles.settingDescription}>
              {drawerLocked ? 'Swipe gesture dinonaktifkan' : 'Swipe gesture diaktifkan'}
            </Text>
          </View>
          <Switch
            value={!drawerLocked}
            onValueChange={(value) => setDrawerLocked(!value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={!drawerLocked ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={handleUnlockDrawer}>
          <Text style={styles.actionButtonText}>Aktifkan Swipe Gesture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleLockDrawer}>
          <Text style={styles.actionButtonText}>Nonaktifkan Swipe Gesture</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.homeButton]} 
          onPress={handleNavigateHome}
        >
          <Text style={styles.homeButtonText}>⬅ Kembali ke Home & Tutup Drawer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan Umum</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Notifikasi</Text>
            <Text style={styles.settingDescription}>
              Terima notifikasi promo dan update
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? '#2196F3' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Mode Gelap</Text>
            <Text style={styles.settingDescription}>
              Aktifkan tampilan mode gelap
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#2196F3' : '#f4f3f4'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;