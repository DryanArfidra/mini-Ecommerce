import React, { useEffect } from 'react';
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

interface ProfileScreenParams {
  userId?: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const { isAuthenticated, user, logout } = useAuth();
  
  const params = route.params as ProfileScreenParams;
  const linkedUserId = params?.userId;

  useEffect(() => {
    // Validasi parameter userId dari deep linking
    if (linkedUserId) {
      if (!isValidUserId(linkedUserId)) {
        Alert.alert(
          'Invalid User ID',
          'The user ID in the link is not valid. Showing your profile instead.',
          [{ text: 'OK' }]
        );
      } else if (isAuthenticated && user?.id !== linkedUserId) {
        Alert.alert(
          'Different User',
          `This link is for user ${linkedUserId}, but you're logged in as ${user?.id}. Showing your profile.`,
          [{ text: 'OK' }]
        );
      }
    }
  }, [linkedUserId, isAuthenticated, user]);

  const isValidUserId = (userId: string): boolean => {
    return /^[a-zA-Z0-9]{3,}$/.test(userId);
  };

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
          {linkedUserId && (
            <View style={styles.deepLinkInfo}>
              <Text style={styles.deepLinkText}>
                Deep Link User ID: {linkedUserId}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLoginPress}
          >
            <Icon name="log-in" size={20} color="white" />
            <Text style={styles.loginButtonText}>Login Sekarang</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {linkedUserId && (
          <View style={styles.deepLinkBanner}>
            <Icon name="link" size={16} color="#1976d2" />
            <Text style={styles.deepLinkBannerText}>
              Opened via deep link for user: {linkedUserId}
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{user?.name || 'User Name'}</Text>
          <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          
          <View style={styles.userIdContainer}>
            <Text style={styles.userIdLabel}>User ID:</Text>
            <Text style={styles.userIdValue}>{user?.id || 'N/A'}</Text>
          </View>

          {linkedUserId && linkedUserId !== user?.id && (
            <View style={styles.linkedUserIdContainer}>
              <Text style={styles.linkedUserIdLabel}>Linked User ID:</Text>
              <Text style={styles.linkedUserIdValue}>{linkedUserId}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
  deepLinkInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  deepLinkText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  deepLinkBanner: {
    backgroundColor: '#e8f5e8',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  deepLinkBannerText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
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
  userIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 15,
  },
  userIdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginRight: 6,
  },
  userIdValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  linkedUserIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  linkedUserIdLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57c00',
    marginRight: 6,
  },
  linkedUserIdValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f57c00',
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
});

export default ProfileScreen;