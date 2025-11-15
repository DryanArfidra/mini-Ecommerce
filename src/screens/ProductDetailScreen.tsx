// src/screens/ProductDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigation/ProductStackNavigator';
import { apiMethods } from '../services/apiClient';
import Toast from 'react-native-toast-message';

type ProductDetailScreenRouteProp = RouteProp<ProductStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<ProductStackParamList, 'ProductDetail'>;

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

// Fallback data untuk graceful degradation
const FALLBACK_PRODUCT: Product = {
  id: 0,
  title: 'Product Information',
  description: 'This product information is temporarily unavailable. Please check your connection and try again.',
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: 'Unknown',
  category: 'general',
  thumbnail: 'https://via.placeholder.com/300x300/cccccc/969696?text=No+Image',
  images: [],
};

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const { productId } = route.params;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      console.log(`🟡 Fetching product details for ID: ${productId}`);
      
      const response = await apiMethods.getProduct(productId);
      const productData: Product = response.data;
      
      console.log('🟢 Product details fetched successfully');
      setProduct(productData);
      
    } catch (err: any) {
      console.error('🔴 Failed to fetch product details:', {
        status: err.response?.status,
        message: err.message,
        productId,
      });

      // Log specific status codes
      if (err.response?.status === 404) {
        console.log('📝 HTTP 404 - Product not found');
      } else if (err.response?.status === 500) {
        console.log('📝 HTTP 500 - Internal server error');
      }

      // Graceful degradation: use fallback data for 404 or 500 errors
      if (err.response?.status === 404 || err.response?.status === 500) {
        setProduct(FALLBACK_PRODUCT);
        setUsingFallback(true);
        
        // Show non-blocking toast notification
        Toast.show({
          type: 'info',
          text1: 'Informasi Produk',
          text2: 'Gagal memuat data terbaru. Menampilkan versi arsip.',
          visibilityTime: 4000,
          position: 'bottom',
        });
      } else {
        setError(err.userMessage || 'Failed to load product details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchProductDetail();
  };

  const handleCheckout = () => {
    if (product) {
      navigation.navigate('Checkout', { productId: product.id.toString() });
    }
  };

  const displayProduct = product || FALLBACK_PRODUCT;
  const discountedPrice = displayProduct.price - (displayProduct.price * displayProduct.discountPercentage / 100);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error && !usingFallback) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Fallback Indicator */}
      {usingFallback && (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>
            ⚠️ Menampilkan informasi produk dasar
          </Text>
        </View>
      )}

      <Image 
        source={{ uri: displayProduct.thumbnail }} 
        style={styles.image}
        defaultSource={{ uri: 'https://via.placeholder.com/300x300/cccccc/969696?text=Loading...' }}
      />
      
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          {usingFallback && (
            <Text style={[styles.badge, styles.fallbackBadge]}>Offline Mode</Text>
          )}
          {displayProduct.discountPercentage > 0 && (
            <Text style={[styles.badge, styles.discountBadge]}>
              -{Math.round(displayProduct.discountPercentage)}%
            </Text>
          )}
          {displayProduct.rating > 4.5 && (
            <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>
          )}
        </View>

        <Text style={styles.name}>{displayProduct.title}</Text>
        <Text style={styles.category}>Category: {displayProduct.category}</Text>
        <Text style={styles.brand}>Brand: {displayProduct.brand}</Text>
        
        <Text style={styles.description}>{displayProduct.description}</Text>

        <View style={styles.priceContainer}>
          {displayProduct.discountPercentage > 0 ? (
            <>
              <Text style={styles.discountedPrice}>${discountedPrice.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${displayProduct.price.toFixed(2)}</Text>
            </>
          ) : displayProduct.price > 0 ? (
            <Text style={styles.price}>${displayProduct.price.toFixed(2)}</Text>
          ) : null}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Rating</Text>
            <Text style={styles.statValue}>⭐ {displayProduct.rating}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Stock</Text>
            <Text style={[
              styles.statValue,
              displayProduct.stock < 5 ? styles.lowStock : styles.inStock
            ]}>
              {displayProduct.stock}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Brand</Text>
            <Text style={styles.statValue}>{displayProduct.brand}</Text>
          </View>
        </View>

        {!usingFallback && (
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={handleCheckout}
            disabled={displayProduct.stock === 0}
          >
            <Text style={styles.buyButtonText}>
              {displayProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        )}

        {usingFallback && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Retry Loading</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toast Component */}
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  fallbackBanner: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  fallbackText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
    overflow: 'hidden',
  },
  fallbackBadge: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  discountBadge: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  popularBadge: {
    backgroundColor: '#4CAF50',
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
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  brand: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  inStock: {
    color: '#4CAF50',
  },
  lowStock: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;