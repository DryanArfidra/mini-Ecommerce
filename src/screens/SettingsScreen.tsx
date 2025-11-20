import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => Alert.alert('Success', 'Cache cleared successfully')
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showSwitch = false, 
    value = false, 
    onValueChange 
  }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={showSwitch}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={24} color="#2196F3" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#2196F3' : '#f4f3f4'}
        />
      ) : (
        <Icon name="chevron-forward" size={20} color="#ccc" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive order updates and promotions"
            showSwitch={true}
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            showSwitch={true}
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Free up storage space"
            onPress={handleClearCache}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <SettingItem
            icon="information-circle-outline"
            title="App Version"
            subtitle="v1.0.0"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms of Service"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen;