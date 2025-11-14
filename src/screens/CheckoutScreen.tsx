import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { initialProducts } from '../data/initialProducts';
import Icon from 'react-native-vector-icons/Ionicons';

type CheckoutScreenRouteProp = RouteProp<HomeStackParamList, 'Checkout'>;
type CheckoutScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const route = useRoute<CheckoutScreenRouteProp>();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { productId } = route.params;

  const product = initialProducts.find(p => p.id === productId);

  const handleConfirmOrder = () => {
    Alert.alert(
      'Order Confirmed',
      'Pesanan Anda berhasil dikonfirmasi!',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleClose = () => {
    navigation.goBack();
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produk tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ MODAL HEADER */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Checkout</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.productInfo}>
          <Text style={styles.sectionTitle}>Produk Dipilih</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>
            Rp {product.price.toLocaleString('id-ID')}
          </Text>
          <Text style={styles.productCategory}>Kategori: {product.category}</Text>
        </View>

        <View style={styles.shippingInfo}>
          <Text style={styles.sectionTitle}>Informasi Pengiriman</Text>
          <Text style={styles.shippingText}>Standard Delivery</Text>
          <Text style={styles.shippingText}>Estimasi: 2-3 hari</Text>
          <Text style={styles.shippingText}>Biaya: Rp 15.000</Text>
        </View>

        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
          <Text style={styles.paymentText}>Transfer Bank</Text>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Pembayaran:</Text>
          <Text style={styles.totalAmount}>
            Rp {(product.price + 15000).toLocaleString('id-ID')}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmButtonText}>Konfirmasi Pesanan</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productInfo: {
    marginBottom: 24,
  },
  shippingInfo: {
    marginBottom: 24,
  },
  paymentInfo: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#666',
  },
  shippingText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;