// src/screens/ProductListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigation/ProductStackNavigator';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { apiMethods } from '../services/apiClient';

type ProductListScreenNavigationProp = NativeStackNavigationProp<ProductStackParamList, 'ProductList'>;

export interface Product {
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

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  success?: boolean;
  message?: string;
}

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const networkState = useNetworkStatus();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const fetchProducts = useCallback(async (isRefreshing = false) => {
    // Check network connection before making request
    if (networkState.isInternetReachable === false) {
      setError('Anda sedang Offline. Cek koneksi Anda.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    // Set timeout for 7 seconds
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout after 7 seconds');
      controller.abort();
    }, 7000);

    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      setError(null);
      
      console.log('🟡 Fetching products from API...');
      
      // Using axios with abort signal
      const response = await apiMethods.getProducts();
      
      const data: ProductsResponse = response.data;
      
      console.log('🟢 Products fetched successfully:', data.products.length);
      setProducts(data.products);
      
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        console.log('🟠 Fetch aborted due to timeout or unmount');
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.userMessage) {
        console.log('🔴 API Error:', err.userMessage);
        setError(err.userMessage);
      } else {
        console.log('🔴 Fetch error:', err.message);
        setError(err.message || 'Failed to fetch products. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      clearTimeout(timeoutId);
      setAbortController(null);
    }
  }, [networkState.isInternetReachable]);

  // Initial load
  useEffect(() => {
    fetchProducts();

    // Cleanup function - abort request if component unmounts
    return () => {
      if (abortController) {
        console.log('🟠 Component unmounting - aborting request');
        abortController.abort();
      }
    };
  }, [fetchProducts]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts(true);
  }, [fetchProducts]);

  const handleProductPress = (product: Product) => {
    console.log('👆 Product pressed:', product.id, product.title);
    navigation.navigate('ProductDetail', { 
      productId: product.id.toString(),
      productTitle: product.title // ✅ FIXED: productTitle sekarang valid
    });
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductCard = ({ product }: { product: Product }) => {
    const discountedPrice = product.price - (product.price * product.discountPercentage / 100);

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleProductPress(product)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: product.thumbnail }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.badgeContainer}>
          {product.discountPercentage > 0 && (
            <Text style={[styles.badge, styles.discountBadge]}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          )}
          {product.rating > 4.5 && (
            <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>
          )}
          {product.stock < 10 && (
            <Text style={[styles.badge, styles.lowStockBadge]}>Low Stock</Text>
          )}
        </View>

        <Text style={styles.name} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.brand}>{product.brand}</Text>
        
        <View style={styles.priceContainer}>
          {product.discountPercentage > 0 ? (
            <>
              <Text style={styles.discountedPrice}>${discountedPrice.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {product.rating}</Text>
            <Text style={styles.reviews}>({Math.floor(Math.random() * 1000)})</Text>
          </View>
          <Text style={[
            styles.stock,
            product.stock < 5 ? styles.lowStock : styles.inStock
          ]}>
            {product.stock} left
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const NetworkStatus = () => {
    if (networkState.isConnected === null) {
      return null;
    }

    const getConnectionTypeText = () => {
      if (!networkState.isConnected) return 'No Connection';
      
      switch (networkState.type) {
        case 'wifi':
          return 'WiFi';
        case 'cellular':
          return networkState.details?.cellularGeneration || 'Mobile Data';
        case 'ethernet':
          return 'Ethernet';
        default:
          return networkState.type || 'Unknown';
      }
    };

    const getStatusColor = () => {
      if (!networkState.isConnected || !networkState.isInternetReachable) {
        return '#f44336';
      }
      return networkState.type === 'wifi' ? '#4CAF50' : '#FF9800';
    };

    return (
      <View style={[styles.networkStatus, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.networkStatusText}>
          {!networkState.isConnected || !networkState.isInternetReachable 
            ? '📵 Offline - No Internet Connection' 
            : networkState.type === 'wifi' ? '📶 WiFi Connected' : '📱 Mobile Data'
          }
          {networkState.isConnected && networkState.isInternetReachable && 
            ` - ${getConnectionTypeText()}`
          }
        </Text>
      </View>
    );
  };

  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading products...</Text>
        <Text style={styles.loadingSubtext}>Fetching from API</Text>
        <NetworkStatus />
      </View>
    );
  }

  // Render error state
  if (error && products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchProducts()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <NetworkStatus />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products by name, category, or brand..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={() => setSearchQuery('')}
          >
            <Text style={styles.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultCount}>
          {filteredProducts.length} of {products.length} products
          {searchQuery && ` for "${searchQuery}"`}
        </Text>
        {searchQuery && filteredProducts.length === 0 && (
          <Text style={styles.noResultsText}>
            No products found. Try different keywords.
          </Text>
        )}
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <View style={styles.productCardWrapper}>
            <ProductCard product={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          filteredProducts.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2196F3']}
            tintColor="#2196F3"
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try different search terms' : 'Check your connection and pull to refresh'}
              </Text>
            </View>
          ) : null
        }
      />

      <NetworkStatus />
    </View>
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
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#999',
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
    lineHeight: 22,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    paddingRight: 40,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  clearSearchButton: {
    position: 'absolute',
    right: 28,
    padding: 8,
  },
  clearSearchText: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  productCardWrapper: {
    width: '50%',
    padding: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 300,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  discountBadge: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  lowStockBadge: {
    backgroundColor: '#FF5252',
    color: 'white',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 18,
    color: '#1a1a1a',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  brand: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
    fontWeight: '500',
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2196F3',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2196F3',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#FFA000',
    fontWeight: '600',
  },
  reviews: {
    fontSize: 10,
    color: '#999',
    marginLeft: 4,
  },
  stock: {
    fontSize: 11,
    fontWeight: '500',
  },
  inStock: {
    color: '#4CAF50',
  },
  lowStock: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  networkStatus: {
    padding: 12,
    alignItems: 'center',
  },
  networkStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProductListScreen;