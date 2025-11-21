import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; 
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Added missing import

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileScreenParams {
  userId?: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const route = useRoute();
  const { isAuthenticated, user, logout } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [ktpBase64, setKtpBase64] = useState<string | null>(null);
  
  const params = route.params as ProfileScreenParams;
  const linkedUserId = params?.userId;

  // b. Izin Penyimpanan untuk Backup Foto (Android)
  const requestStoragePermissionAndSave = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // iOS tidak perlu permission WRITE_EXTERNAL_STORAGE
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Izin Penyimpanan Foto KTP',
          message: 'Aplikasi membutuhkan izin untuk menyimpan foto KTP ke galeri sebagai backup keamanan',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Setujui',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Izin penyimpanan diberikan');
        return true;
      } else {
        console.log('Izin penyimpanan ditolak');
        Alert.alert(
          'Izin Ditolak',
          'Foto KTP tidak akan disimpan di galeri publik. Foto hanya akan digunakan untuk verifikasi internal.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  };

  const handleTakeKTPPhoto = async () => {
    try {
      const hasPermission = await requestStoragePermissionAndSave();
      
      const options: any = {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
        includeBase64: true, // Untuk preview cepat
      };

      // Jika izin diberikan, simpan ke galeri
      if (hasPermission && Platform.OS === 'android') {
        options.saveToPhotos = true;
      }

      const result = await launchCamera(options);

      if (result.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (result.errorCode) {
        // d. Penanganan Error "Kamera Tidak Tersedia"
        if (result.errorCode === 'camera_unavailable') {
          Alert.alert(
            'Kamera Tidak Tersedia',
            'Kamera tidak bisa dibuka. Apakah Anda ingin memilih foto dari galeri?',
            [
              { text: 'Batal', style: 'cancel' },
              { 
                text: 'Buka Galeri', 
                onPress: handleSelectKTPFromGallery 
              },
            ]
          );
          return;
        }
        
        Alert.alert('Error', `Error kamera: ${result.errorMessage}`);
        return;
      }

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        await handleKTPUpload(asset);
        
        // e. Simpan Preview Cepat (Base64)
        if (asset.base64) {
          setKtpBase64(asset.base64);
          await AsyncStorage.setItem('@ecom:ktpPreview', asset.base64);
        }
      }
    } catch (error) {
      console.error('Error taking KTP photo:', error);
      Alert.alert('Error', 'Gagal mengambil foto KTP');
    }
  };

  const handleSelectKTPFromGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxWidth: 300,  // Ukuran kecil untuk preview
        maxHeight: 300, // Ukuran kecil untuk preview
        quality: 0.5,
        includeBase64: true, // Untuk preview cepat
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // Simpan base64 untuk preview cepat
        if (asset.base64) {
          setKtpBase64(asset.base64);
          await AsyncStorage.setItem('@ecom:ktpPreview', asset.base64);
        }

        await handleKTPUpload(asset);
      }
    } catch (error) {
      console.error('Error selecting KTP from gallery:', error);
      Alert.alert('Error', 'Gagal memilih foto KTP');
    }
  };

  // c. Upload File dengan Indikator Loading
  const handleKTPUpload = async (asset: Asset) => {
    if (!asset.uri) return;

    setUploading(true);

    try {
      const formData = new FormData();
      
      formData.append('ktp_photo', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `ktp_${Date.now()}.jpg`,
      } as any);

      formData.append('userId', user?.id || 'unknown');
      formData.append('uploadTime', new Date().toISOString());

      // Simulasi upload - ganti dengan API sesungguhnya
      console.log('📤 Uploading KTP photo...', {
        size: asset.fileSize,
        type: asset.type,
        hasBase64: !!asset.base64,
      });

      // Simulasi delay upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Foto KTP berhasil diupload dan disimpan');
      
    } catch (error) {
      console.error('Error uploading KTP:', error);
      Alert.alert('Error', 'Gagal mengupload foto KTP');
    } finally {
      setUploading(false);
    }
  };

  // Load saved KTP preview on component mount
  useEffect(() => {
    const loadKTPPreview = async () => {
      try {
        const savedPreview = await AsyncStorage.getItem('@ecom:ktpPreview');
        if (savedPreview) {
          setKtpBase64(savedPreview);
        }
      } catch (error) {
        console.error('Error loading KTP preview:', error);
      }
    };

    loadKTPPreview();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin logout?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRight} />
        </View>

        {/* User Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Pengguna</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Nama:</Text>
            <Text style={styles.userInfoValue}>{user?.name || 'Tidak tersedia'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>Email:</Text>
            <Text style={styles.userInfoValue}>{user?.email || 'Tidak tersedia'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoLabel}>User ID:</Text>
            <Text style={styles.userInfoValue}>{user?.id || 'Tidak tersedia'}</Text>
          </View>
        </View>

        {/* KTP Verification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verifikasi KTP</Text>
          
          {/* KTP Preview */}
          {ktpBase64 ? (
            <View style={styles.ktpPreviewContainer}>
              <Image 
                source={{ uri: `data:image/jpeg;base64,${ktpBase64}` }} 
                style={styles.ktpPreviewImage}
              />
              <Text style={styles.ktpPreviewText}>
                Preview KTP (Tersimpan Offline)
              </Text>
            </View>
          ) : (
            <Text style={styles.noKtpText}>
              Belum ada foto KTP yang diupload
            </Text>
          )}

          {/* KTP Action Buttons */}
          <View style={styles.ktpActions}>
            <TouchableOpacity 
              style={[
                styles.ktpButton,
                styles.primaryKtpButton,
                uploading && styles.disabledButton
              ]}
              onPress={handleTakeKTPPhoto}
              disabled={uploading}
            >
              <Icon name="camera-outline" size={20} color="white" />
              <Text style={styles.ktpButtonText}>
                {uploading ? 'Mengupload...' : 'Ambil Foto KTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.ktpButton,
                styles.secondaryKtpButton,
                uploading && styles.disabledButton
              ]}
              onPress={handleSelectKTPFromGallery}
              disabled={uploading}
            >
              <Icon name="images-outline" size={20} color="#2196F3" />
              <Text style={[styles.ktpButtonText, styles.secondaryKtpButtonText]}>
                Pilih dari Galeri
              </Text>
            </TouchableOpacity>
          </View>

          {uploading && (
            <View style={styles.uploadingIndicator}>
              <Text style={styles.uploadingText}>
                ⏳ Mengupload foto KTP...
              </Text>
            </View>
          )}
        </View>

        {/* Logout Button */}
        {isAuthenticated && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="log-out-outline" size={20} color="white" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  ktpPreviewContainer: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  ktpPreviewImage: {
    width: 200,
    height: 120,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  ktpPreviewText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noKtpText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  ktpActions: {
    flexDirection: 'row',
    gap: 10,
  },
  ktpButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryKtpButton: {
    backgroundColor: '#2196F3',
  },
  secondaryKtpButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  disabledButton: {
    opacity: 0.6,
  },
  ktpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  secondaryKtpButtonText: {
    color: '#2196F3',
  },
  uploadingIndicator: {
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
  uploadingText: {
    color: '#f57c00',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;