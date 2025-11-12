import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import EvilIcons from '@react-native-vector-icons/evil-icons';

/**
 * Custom drawer component untuk React Navigation v7 + TypeScript 5
 * Sudah fix error: "Property 'children' is missing"
 */
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const userProfile = {
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=3',
  };

  return (
    <DrawerContentScrollView
      {...(props as any)} // 🩵 fix TypeScript type mismatch di v7.x
      contentContainerStyle={{ flex: 1 }}
      // ⬇️ Tambahkan children secara eksplisit agar TS puas
      children={
        <>
          {/* Profil user */}
          <View style={styles.profileContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <Text style={styles.profileName}>{userProfile.name}</Text>
          </View>

          {/* Menu utama */}
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => props.navigation.navigate('Home')}
            >
              <EvilIcons name="gear" size={28} color="#333" />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => props.navigation.navigate('Settings')}
            >
              <EvilIcons name="gear" size={28} color="#333" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Tombol logout di bawah */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => Alert.alert('Logout', 'Anda telah keluar.')}
            >
              <FontAwesome6
                name="right-from-bracket"
                size={20}
                color="#e74c3c"
                iconStyle="solid"
              />
              <Text style={[styles.menuText, { color: '#e74c3c' }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      }
    />
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
  },
});

export default CustomDrawerContent;
