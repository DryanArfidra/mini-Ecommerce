import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface CartTotal {
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

const CART_STORAGE_KEY = 'user_cart';

const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const route = useRoute(); 
  
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pollingCount, setPollingCount] = useState(0);
  const [deepLinkOpened, setDeepLinkOpened] = useState(false); 
  const networkState = useNetworkStatus();

  useEffect(() => {
    const checkDeepLink = () => {
      console.log('🛒 CartScreen opened via deep link');
      setDeepLinkOpened(true);
      
      Alert.alert(
        'Deep Link Success',
        'Cart screen opened via deep link!',
        [{ text: 'OK' }]
      );
    };

    if (route.params) {
      checkDeepLink();
    }
  }, [route.params]);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const loadCartFromStorage = async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart.items || []);
        calculateLocalTotal(parsedCart.items || []);
        console.log('🛒 Cart loaded from storage:', parsedCart.items.length, 'items');
      }
    } catch (error) {
      console.error('❌ Error loading cart from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToStorage = async (items: CartItem[]) => {
    try {
      const cartData = {
        items,
        lastUpdated: new Date().toISOString(),
      };
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      console.log('💾 Cart saved to storage');
    } catch (error: any) {
      console.error('❌ Error saving cart:', error);
      
      if (error?.message?.includes('QuotaExceededError') || error?.message?.includes('exceeded')) {
        Alert.alert(
          'Storage Full',
          'Your device storage is full. Please free up some space to save your cart.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    try {
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ).filter(item => item.quantity > 0);

      setCartItems(updatedItems);
      calculateLocalTotal(updatedItems);

      try {
        await AsyncStorage.mergeItem(CART_STORAGE_KEY, JSON.stringify({
          items: updatedItems
        }));
        console.log('🔄 Cart item updated with mergeItem');
      } catch (mergeError) {
        console.log('🔄 Fallback to full cart save');
        await saveCartToStorage(updatedItems);
      }

    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      Alert.alert('Error', 'Failed to update cart item');
    }
  };

  const addSampleItem = async () => {
    const newItem: CartItem = {
      id: `item_${Date.now()}`,
      productId: Math.floor(Math.random() * 1000),
      name: `Sample Product ${cartItems.length + 1}`,
      price: Math.floor(Math.random() * 100) + 10,
      quantity: 1,
    };

    const updatedItems = [...cartItems, newItem];
    setCartItems(updatedItems);
    calculateLocalTotal(updatedItems);
    await saveCartToStorage(updatedItems);
  };

  const calculateLocalTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal({
      total,
      discountedTotal: total * 0.9,
      totalProducts: items.length,
      totalQuantity,
    });
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      setCartItems([]);
      setCartTotal(null);
      Alert.alert('Success', 'Cart cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
      Alert.alert('Error', 'Failed to clear cart');
    }
  };

  const navigateToProducts = () => {
    navigation.navigate('Main' as any); // Navigate ke main tab
  };

  const fetchCartTotal = async () => {
    try {
      console.log(`🛒 Fetching cart total (poll #${pollingCount + 1})`);
      
      const response = await apiClient.get('/carts/1');
      const cartData = response.data;
      
      const totalData: CartTotal = {
        total: cartData.total,
        discountedTotal: cartData.discountedTotal,
        totalProducts: cartData.totalProducts,
        totalQuantity: cartData.totalQuantity,
      };
      
      setCartTotal(totalData);
      setPollingCount(prev => prev + 1);
      
    } catch (error: any) {
      console.error('❌ Failed to fetch cart total:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartTotal();

    let intervalId: NodeJS.Timeout;

    if (networkState.type !== 'cellular') {
      console.log('🔔 Starting cart polling (15s interval)');
      
      intervalId = setInterval(() => {
        fetchCartTotal();
      }, 15000);
    } else {
      console.log('📵 Polling disabled - cellular network detected');
    }

    return () => {
      if (intervalId) {
        console.log('🛑 Cleaning up polling interval');
        clearInterval(intervalId);
      }
    };
  }, [networkState.type]);

  const getNetworkStatusText = () => {
    if (networkState.type === 'cellular') {
      return '📱 Mobile Data - Polling Disabled';
    }
    return networkState.isInternetReachable ? '✅ Online - Polling Active' : '📵 Offline';
  };

  if (loading && !cartTotal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Deep Link Banner */}
        {deepLinkOpened && (
          <View style={styles.deepLinkBanner}>
            <Text style={styles.deepLinkBannerText}>
              🎉 Cart opened via Deep Link!
            </Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>
            {deepLinkOpened ? 'Opened via deep link 🎯' : 'Your cart summary'}
          </Text>
        </View>

        {/* Network Status */}
        <View style={[
          styles.networkStatus, 
          networkState.type === 'cellular' ? styles.cellularWarning : styles.onlineStatus
        ]}>
          <Text style={styles.networkStatusText}>
            {getNetworkStatusText()}
          </Text>
          <Text style={styles.pollingCount}>
            Polling updates: {pollingCount}
          </Text>
        </View>

        {/* Cart Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={addSampleItem}>
            <Text style={styles.actionButtonText}>Add Sample Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearCart}>
            <Text style={styles.actionButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.shopButton]} onPress={navigateToProducts}>
            <Text style={styles.actionButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {cartItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🛒</Text>
            <Text style={styles.emptyStateTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyStateText}>
              {deepLinkOpened 
                ? 'Add some products to get started!' 
                : 'Start shopping to add items to your cart'
              }
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={navigateToProducts}>
              <Text style={styles.emptyStateButtonText}>Browse Products</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Local Cart Items */}
        {cartItems.length > 0 && (
          <View style={styles.localCartSection}>
            <Text style={styles.sectionTitle}>Your Cart Items ({cartItems.length})</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price} x {item.quantity}</Text>
                  <Text style={styles.itemTotal}>Total: ${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cart Summary */}
        {cartTotal && cartItems.length > 0 && (
          <View style={styles.cartSummary}>
            <Text style={styles.summaryTitle}>Cart Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Products:</Text>
              <Text style={styles.summaryValue}>{cartTotal.totalProducts}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Quantity:</Text>
              <Text style={styles.summaryValue}>{cartTotal.totalQuantity}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Original Total:</Text>
              <Text style={styles.summaryValue}>${cartTotal.total.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Discounted Total:</Text>
              <Text style={[styles.summaryValue, styles.discountedPrice]}>
                ${cartTotal.discountedTotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.savings}>
              <Text style={styles.savingsText}>
                You save: ${(cartTotal.total - cartTotal.discountedTotal).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Deep Link Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            {deepLinkOpened ? '🎯 Deep Link Activated' : 'Cart Information'}
          </Text>
          <Text style={styles.infoText}>
            • {deepLinkOpened ? 'Opened via ecommerceapp://keranjang' : 'Cart data persisted locally'}
          </Text>
          <Text style={styles.infoText}>
            • {deepLinkOpened ? 'Warm start handled successfully' : 'Uses efficient storage updates'}
          </Text>
          <Text style={styles.infoText}>
            • Test deep link: ecommerceapp://keranjang
          </Text>
          <Text style={styles.infoText}>
            • Last updated: {new Date().toLocaleTimeString()}
          </Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  // Deep Link Banner
  deepLinkBanner: {
    backgroundColor: '#4CAF50',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deepLinkBannerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  networkStatus: {
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  onlineStatus: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  cellularWarning: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  networkStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  pollingCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  shopButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  // Empty State
  emptyState: {
    backgroundColor: 'white',
    margin: 16,
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  localCartSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  cartSummary: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  discountedPrice: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  savings: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
});

export default CartScreen;