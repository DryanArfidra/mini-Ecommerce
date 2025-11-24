import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigation/ProductStackNavigator';
import { apiMethods } from '../services/apiClient';
import KeychainService from '../services/KeychainService';

type CheckoutScreenRouteProp = RouteProp<ProductStackParamList, 'Checkout'>;
type CheckoutScreenNavigationProp = NativeStackNavigationProp<ProductStackParamList, 'Checkout'>;

interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
}

const CheckoutScreen: React.FC = () => {
  const route = useRoute<CheckoutScreenRouteProp>();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { productId } = route.params;

  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  // Check biometric availability on component mount
  React.useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const sensorInfo = await KeychainService.isSensorAvailable();
      setBiometricAvailable(sensorInfo.available);
    } catch (error) {
      console.error('❌ Error checking biometric availability:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    } else if (form.address.trim().length < 10) {
      newErrors.address = 'Alamat terlalu pendek';
    }

    if (!form.city.trim()) {
      newErrors.city = 'Kota wajib diisi';
    }

    if (!form.postalCode.trim()) {
      newErrors.postalCode = 'Kode pos wajib diisi';
    } else if (!/^\d{5}$/.test(form.postalCode)) {
      newErrors.postalCode = 'Kode pos harus 5 digit';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (!/^\d{10,13}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Process payment after biometric confirmation
  const processPayment = async () => {
    try {
      console.log('💳 Processing payment...');
      
      // Simulate API call to checkout endpoint
      const response = await apiMethods.post('/carts/add', {
        productId: parseInt(productId),
        quantity: 1,
        customerInfo: form,
        paymentStatus: 'completed',
        amount: 500000,
      });

      console.log('🟢 Payment successful');
      setSubmitted(true);
      
      Alert.alert(
        'Pembayaran Berhasil',
        'Transfer Rp 500.000 berhasil diproses! Pesanan Anda sedang dikonfirmasi.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (err: any) {
      console.error('🔴 Payment failed:', err.response?.data);
      
      // Handle 400 Bad Request with field-specific errors
      if (err.response?.status === 400) {
        const serverErrors = err.response.data?.errors;
        if (serverErrors) {
          setErrors(serverErrors);
          return;
        }
      }

      Alert.alert(
        'Pembayaran Gagal',
        err.userMessage || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
      );
    }
  };

  // Handle transaction confirmation with biometric
  const handleTransactionConfirmation = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Starting transaction confirmation...');

      if (biometricAvailable) {
        // Use biometric confirmation for transaction
        const result = await KeychainService.simplePrompt(
          'Konfirmasi Transfer Rp 500.000'
        );

        if (result.success) {
          console.log('✅ Biometric confirmation successful, processing payment...');
          await processPayment();
        } else {
          console.log('❌ Biometric confirmation failed or canceled:', result.error);
          Alert.alert(
            'Transaksi Dibatalkan',
            'Konfirmasi biometrik gagal atau dibatalkan. Transaksi tidak diproses.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Fallback to manual confirmation if biometric not available
        Alert.alert(
          'Konfirmasi Transfer',
          'Anda akan mentransfer Rp 500.000. Lanjutkan?',
          [
            {
              text: 'Batal',
              style: 'cancel',
              onPress: () => {
                console.log('❌ Transaction canceled by user');
                Alert.alert('Transaksi Dibatalkan', 'Transfer Rp 500.000 dibatalkan.');
              }
            },
            {
              text: 'Lanjutkan',
              onPress: async () => {
                console.log('✅ Manual confirmation successful, processing payment...');
                await processPayment();
              }
            }
          ]
        );
      }

    } catch (error: any) {
      console.error('❌ Transaction confirmation error:', error);
      
      // Handle specific biometric errors
      if (error.message?.includes('BIOMETRY_NOT_ENROLLED')) {
        Alert.alert(
          'Biometrik Belum Didaftarkan',
          'Sidik jari/wajah belum diatur di perangkat ini. Silakan atur di Settings atau gunakan konfirmasi manual.',
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'Konfirmasi Manual', 
              onPress: async () => {
                // Fallback to manual confirmation
                Alert.alert(
                  'Konfirmasi Manual',
                  'Anda akan mentransfer Rp 500.000. Lanjutkan?',
                  [
                    {
                      text: 'Batal',
                      style: 'cancel',
                    },
                    {
                      text: 'Lanjutkan',
                      onPress: async () => {
                        await processPayment();
                      }
                    }
                  ]
                );
              }
            },
          ]
        );
      } else if (error.message?.includes('BIOMETRY_LOCKOUT')) {
        // Force security cleanup for lockout
        await handleSecurityLockout();
      } else {
        Alert.alert(
          'Error Konfirmasi',
          'Terjadi kesalahan saat konfirmasi. Silakan coba lagi.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityLockout = async () => {
    try {
      console.log('🚨 Security lockout detected during transaction, cleaning secure data...');
      
      // Clean all secure data due to security breach
      await KeychainService.cleanAllSecureData();
      
      Alert.alert(
        'Keamanan Diperlukan',
        'Terlalu banyak percobaan gagal. Untuk keamanan, data login telah direset. Silakan login ulang.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
              });
            }
          },
        ]
      );
    } catch (cleanupError) {
      console.error('❌ Error during security lockout cleanup:', cleanupError);
    }
  };

  const InputField = ({ 
    label, 
    field, 
    placeholder, 
    keyboardType = 'default',
    multiline = false 
  }: {
    label: string;
    field: keyof CheckoutForm;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    multiline?: boolean;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          multiline && styles.multilineInput,
        ]}
        value={form[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={!loading}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Lengkapi informasi pengiriman</Text>
          
          {/* Transaction Info */}
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionAmount}>Total: Rp 500.000</Text>
            <Text style={styles.transactionNote}>
              {biometricAvailable 
                ? 'Konfirmasi dengan biometrik diperlukan' 
                : 'Konfirmasi manual diperlukan'}
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <InputField
            label="Nama Lengkap *"
            field="fullName"
            placeholder="Masukkan nama lengkap"
          />

          <InputField
            label="Email *"
            field="email"
            placeholder="nama@email.com"
            keyboardType="email-address"
          />

          <InputField
            label="Alamat Lengkap *"
            field="address"
            placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
            multiline
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <InputField
                label="Kota *"
                field="city"
                placeholder="Kota"
              />
            </View>
            <View style={styles.halfInput}>
              <InputField
                label="Kode Pos *"
                field="postalCode"
                placeholder="12345"
                keyboardType="numeric"
              />
            </View>
          </View>

          <InputField
            label="Nomor Telepon *"
            field="phone"
            placeholder="081234567890"
            keyboardType="phone-pad"
          />

          {/* Biometric Info */}
          {biometricAvailable && (
            <View style={styles.biometricInfo}>
              <Text style={styles.biometricInfoText}>
                🔒 Transaksi akan dikonfirmasi dengan biometrik
              </Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleTransactionConfirmation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                Konfirmasi & Bayar Rp 500.000
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  transactionInfo: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 4,
  },
  transactionNote: {
    fontSize: 14,
    color: '#FF9800',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  biometricInfo: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  biometricInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;