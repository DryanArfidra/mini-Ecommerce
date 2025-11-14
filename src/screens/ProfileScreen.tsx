import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const { isAuthenticated, user, logout } = useAuth();
  
  const parent = navigation.getParent();
  const parentRoute = parent?.getState().routes[0];
  const userID = user?.id || 'not Available';

  const handleLoginPress = () => {
    navigation.navigate('Login'); 
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            Alert.alert('Success', 'Logout berhasil!');
          }
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authGuardContainer}>
          <Icon name="lock-closed" size={64} color="#ccc" />
          <Text style={styles.authGuardTitle}>Akses Dibatasi</Text>
          <Text style={styles.authGuardText}>
            Anda perlu login untuk mengakses halaman profil
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLoginPress}
          >
            <Icon name="log-in" size={20} color="white" />
            <Text style={styles.loginButtonText}>Login Sekarang</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.demoInfoButton}
            onPress={() => Alert.alert('Info', 'Gunakan: demo@example.com / password123')}
          >
            <Text style={styles.demoInfoText}>Lihat Demo Credentials</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ TAMPILAN NORMAL JIKA SUDAH LOGIN
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Profile */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editPhotoButton}>
              <Icon name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Akun Saya</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="person-outline" size={22} color="#666" />
              <Text style={styles.menuText}>Informasi Profil</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="location-outline" size={22} color="#666" />
              <Text style={styles.menuText}>Alamat Pengiriman</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="card-outline" size={22} color="#666" />
              <Text style={styles.menuText}>Metode Pembayaran</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pesanan</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="bag-handle-outline" size={22} color="#666" />
              <Text style={styles.menuText}>Pesanan Saya</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="time-outline" size={22} color="#666" />
              <Text style={styles.menuText}>Status Pengiriman</Text>
            </View>
            <Icon name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versi 1.0.0</Text>
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
  // Auth Guard Styles
  authGuardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  authGuardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  authGuardText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoInfoButton: {
    padding: 8,
  },
  demoInfoText: {
    color: '#2196F3',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  // Profile Styles
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 25,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProfileScreen;