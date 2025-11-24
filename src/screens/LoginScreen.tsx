import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { useDeepLinking } from '../utils/deepLinkingUtils';
import KeychainService from '../services/KeychainService';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute<LoginScreenRouteProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometryType, setBiometryType] = useState<string>('');
  const [hasBiometricCredentials, setHasBiometricCredentials] = useState(false);
  const { login } = useAuth();
  const { executePendingAction } = useDeepLinking();

  // Check biometric availability on component mount
  useEffect(() => {
    checkBiometricAvailability();
    checkExistingBiometricCredentials();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const sensorInfo = await KeychainService.isSensorAvailable();
      console.log('🔍 Biometric sensor info:', sensorInfo);
      
      if (sensorInfo.available) {
        setBiometryType(sensorInfo.biometryType || 'Biometrics');
      } else {
        console.log('ℹ️ Biometric not available:', sensorInfo.error);
      }
    } catch (error) {
      console.error('❌ Error checking biometric availability:', error);
    }
  };

  const checkExistingBiometricCredentials = async () => {
    try {
      const hasCredentials = await KeychainService.hasBiometricCredentials();
      setHasBiometricCredentials(hasCredentials);
    } catch (error) {
      console.error('❌ Error checking biometric credentials:', error);
    }
  };

  // Handle callback setelah login sukses
  useEffect(() => {
    if (route.params?.callback) {
      console.log('🔗 Login with callback:', route.params.callback);
    }
  }, [route.params]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Attempting login...');
      
      const success = await login(username, password);
      
      if (success) {
        console.log('✅ Login successful!');
        
        // Save credentials for biometric login (hybrid approach)
        try {
          await KeychainService.saveCredentialsWithBiometric(username, password);
          setHasBiometricCredentials(true);
          console.log('✅ Biometric credentials saved for future login');
        } catch (biometricError: any) {
          // Handle biometric errors gracefully - don't block login
          if (biometricError.message?.includes('BIOMETRY_NOT_ENROLLED')) {
            console.log('ℹ️ User not enrolled in biometrics, skipping biometric setup');
          } else {
            console.warn('⚠️ Could not save biometric credentials:', biometricError.message);
          }
        }
        
        // Cek apakah ada pending deep link action
        const hadPendingAction = await executePendingAction();
        
        if (!hadPendingAction && route.params?.callback) {
          // Handle callback dari route params
          const { handleDeepLink } = useDeepLinking();
          handleDeepLink(route.params.callback);
        }
        
        if (!hadPendingAction && !route.params?.callback) {
          Alert.alert('Success', 'Login successful!');
        }
        
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }

    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      Alert.alert('Login Failed', error.message || 'Invalid credentials or network error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setBiometricLoading(true);
    
    try {
      console.log('🔐 Attempting quick login with biometric...');
      
      // Get biometric prompt message based on biometry type
      let promptMessage = 'Tempelkan Jari untuk Masuk';
      if (biometryType === 'FaceID') {
        promptMessage = 'Pindai Wajah untuk Masuk';
      } else if (biometryType === 'TouchID') {
        promptMessage = 'Tempelkan Jari untuk Masuk';
      }
      
      // Get credentials using biometric
      const credentials = await KeychainService.getCredentialsWithBiometric(promptMessage);
      
      if (credentials) {
        console.log('✅ Biometric authentication successful, proceeding with login...');
        
        // Use the retrieved credentials to login
        const success = await login(credentials.username, credentials.password);
        
        if (success) {
          console.log('✅ Quick login successful!');
          
          // Handle pending actions
          const hadPendingAction = await executePendingAction();
          
          if (!hadPendingAction && route.params?.callback) {
            const { handleDeepLink } = useDeepLinking();
            handleDeepLink(route.params.callback);
          }
          
          if (!hadPendingAction && !route.params?.callback) {
            Alert.alert('Success', 'Quick login successful!');
          }
        } else {
          Alert.alert('Error', 'Quick login failed. Please try manual login.');
          // Remove invalid biometric credentials
          await KeychainService.deleteBiometricCredentials();
          setHasBiometricCredentials(false);
        }
      } else {
        Alert.alert('Biometric Login Failed', 'No biometric credentials found. Please login manually first.');
      }
      
    } catch (error: any) {
      console.error('❌ Quick login failed:', error.message);
      
      // Handle specific biometric errors
      if (error.message === 'BIOMETRY_NOT_ENROLLED') {
        Alert.alert(
          'Biometric Not Set Up',
          'Sidik jari/wajah belum diatur di HP ini. Silakan atur di Settings atau gunakan login manual.',
          [
            { text: 'OK', style: 'default' },
            { text: 'Settings', onPress: () => {
              // Arahkan ke settings untuk setup biometric
              // Platform-specific implementation
            }},
          ]
        );
      } else if (error.message === 'BIOMETRY_LOCKOUT') {
        // Force logout due to security breach
        Alert.alert(
          'Security Lockout',
          'Terlalu banyak percobaan gagal. Untuk keamanan, semua data login akan dihapus. Silakan login ulang.',
          [
            { 
              text: 'OK', 
              onPress: async () => {
                await handleSecurityLockout();
              }
            },
          ]
        );
      } else if (error.message === 'AUTHENTICATION_CANCELED') {
        // User canceled, no action needed
        console.log('ℹ️ Biometric authentication canceled by user');
      } else {
        Alert.alert('Biometric Error', error.message || 'Authentication failed. Please try manual login.');
      }
    } finally {
      setBiometricLoading(false);
    }
  };

  const handleSecurityLockout = async () => {
    try {
      console.log('🚨 Security lockout detected, cleaning all secure data...');
      
      // Clean all secure data
      await KeychainService.cleanAllSecureData();
      
      // Reset state
      setHasBiometricCredentials(false);
      
      Alert.alert(
        'Security Reset',
        'Data keamanan telah direset. Silakan login ulang dengan username dan password.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Error during security lockout cleanup:', error);
    }
  };

  const handleDemoLogin = () => {
    setUsername('kminchelle');
    setPassword('0lelplR');
  };

  const getBiometricButtonText = () => {
    if (biometricLoading) return 'Authenticating...';
    
    if (biometryType === 'FaceID') return 'Login dengan Face ID';
    if (biometryType === 'TouchID') return 'Login dengan Touch ID';
    
    return 'Login Cepat dengan Biometrik';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity 
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Quick Login Button */}
            {hasBiometricCredentials && (
              <TouchableOpacity 
                style={[styles.quickLoginButton, biometricLoading && styles.disabledButton]}
                onPress={handleQuickLogin}
                disabled={biometricLoading}
              >
                {biometricLoading ? (
                  <ActivityIndicator color="#2196F3" />
                ) : (
                  <>
                    <Text style={styles.quickLoginButtonText}>{getBiometricButtonText()}</Text>
                    <Text style={styles.quickLoginSubtext}>Gunakan biometrik untuk login cepat</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={loading}
            >
              <Text style={styles.demoButtonText}>Use Demo Credentials</Text>
            </TouchableOpacity>

            <View style={styles.demoInfo}>
              <Text style={styles.demoInfoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoInfoText}>Username: kminchelle</Text>
              <Text style={styles.demoInfoText}>Password: 0lelplR</Text>
              <Text style={styles.demoInfoText}>(or any valid DummyJSON credentials)</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// UPDATE Styles untuk tambah quick login button
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#90CAF9',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickLoginButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
    marginBottom: 12,
  },
  quickLoginButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickLoginSubtext: {
    color: '#2196F3',
    fontSize: 12,
    marginTop: 4,
  },
  demoButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 20,
  },
  demoButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  demoInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  demoInfoText: {
    fontSize: 12,
    color: '#1976d2',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default LoginScreen;