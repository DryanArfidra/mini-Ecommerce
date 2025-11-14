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
import { useAuth } from '../context/AuthContext';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { isAuthenticated, login, logout, authToken } = useAuth();

  // Jika belum login, tampilkan placeholder
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Text style={styles.authTitle}>🔐 Harap Login</Text>
        <Text style={styles.authDescription}>
          Login untuk mengakses profil dan pengaturan akun Anda
        </Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => login('simulated-token-' + Date.now())}
        >
          <Text style={styles.loginButtonText}>Login Simulasi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Konten asli profile screen (jika sudah login)
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
        <Text style={styles.tokenInfo}>Token: {authToken?.substring(0, 20)}...</Text>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            logout();
            Alert.alert('Berhasil', 'Anda telah logout');
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ... rest of the profile content ... */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  authDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  tokenInfo: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;