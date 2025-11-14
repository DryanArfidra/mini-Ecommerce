import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { initialProducts } from '../data/initialProducts';

type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const { productId } = route.params;

  const product = initialProducts.find(p => p.id === productId);

  // ✅ SOAL 3: RESET STACK & TUTUP DRAWER
  const handleResetStack = () => {
    // Reset Stack Navigator ke HomeTabs
    navigation.reset({
      index: 0,
      routes: [{ name: 'HomeTabs' }],
    });

    // Tutup drawer secara programatik
    const drawerNavigation = navigation.getParent() as any;
    if (drawerNavigation && drawerNavigation.closeDrawer) {
      drawerNavigation.closeDrawer();
    }

    Alert.alert('Berhasil', 'Stack telah direset ke Home dan Drawer ditutup');
  };

  // ✅ SOAL 4: KEMBALI KE DRAWER HOME
  const handleBackToDrawerHome = () => {
    // Dapatkan parent navigator (Drawer)
    const parent = navigation.getParent();
    
    if (parent) {
      // Explicitly go back in parent navigator
      (parent as any).goBack();
      Alert.alert('Info', 'Navigasi kembali ke Drawer Home');
    } else {
      Alert.alert('Info', 'Tidak ada parent navigator');
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produk tidak ditemukan</Text>
      </View>
    );
  }

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          {product.isNew && <Text style={[styles.badge, styles.newBadge]}>New</Text>}
          {product.isPopular && <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>}
          {product.discount && <Text style={[styles.badge, styles.discountBadge]}>-{product.discount}%</Text>}
        </View>

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>Kategori: {product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.priceContainer}>
          {product.discount ? (
            <>
              <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString('id-ID')}</Text>
              <Text style={styles.originalPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
            </>
          ) : (
            <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
          )}
        </View>

        {/* ✅ SOAL 3: TOMBOL RESET STACK */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.resetButton]}
          onPress={handleResetStack}
        >
          <Text style={styles.actionButtonText}>🔄 Reset Stack ke Home</Text>
        </TouchableOpacity>

        {/* ✅ SOAL 4: TOMBOL KEMBALI KE DRAWER HOME */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.backButton]}
          onPress={handleBackToDrawerHome}
        >
          <Text style={styles.actionButtonText}>🏠 Kembali ke Drawer Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.buyButton]}
          onPress={() => Alert.alert('Berhasil', 'Produk ditambahkan ke keranjang!')}
        >
          <Text style={styles.buyButtonText}>🛒 Tambah ke Keranjang</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    overflow: 'hidden',
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  discountBadge: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 25,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  backButton: {
    backgroundColor: '#4CAF50',
  },
  buyButton: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;