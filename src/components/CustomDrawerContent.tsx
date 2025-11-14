import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const user = {
    name: 'Dryan Arfidra',
    email: 'Arfidra@example.com',
    avatar: 'https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg',
  };

  return (
    <View style={styles.container}>
      {/* Header dengan Avatar */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <DrawerContentScrollView 
        {...props} 
        contentContainerStyle={styles.drawerContent}
      >
        {/* Menu Items */}
        <DrawerItem
          label="Beranda"
          onPress={() => props.navigation.navigate('MainTabs')}
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => (
            <Text style={[styles.icon, { color }]}>🏠</Text>
          )}
        />
        <DrawerItem
          label="Profil"
          onPress={() => props.navigation.navigate('Profile')}
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => (
            <Text style={[styles.icon, { color }]}>👤</Text>
          )}
        />
        <DrawerItem
          label="Pengaturan"
          onPress={() => props.navigation.navigate('Settings')}
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => (
            <Text style={[styles.icon, { color }]}>⚙️</Text>
          )}
        />
      </DrawerContentScrollView>

      {/* Footer dengan Logout */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout')}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#2196F3',
    borderBottomWidth: 1,
    borderBottomColor: '#1976D2',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    marginLeft: 0,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  drawerContent: {
    paddingTop: 10,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: -16,
  },
  icon: {
    fontSize: 20,
    width: 24,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
  },
});

export default CustomDrawerContent;