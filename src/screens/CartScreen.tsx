import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import apiClient from '../services/apiClient';

interface CartTotal {
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

const CartScreen: React.FC = () => {
  const [cartTotal, setCartTotal] = useState<CartTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [pollingCount, setPollingCount] = useState(0);
  const networkState = useNetworkStatus();

  const fetchCartTotal = async () => {
    try {
      console.log(`🛒 Fetching cart total (poll #${pollingCount + 1})`);
      
      const response = await apiClient.get('/carts/1'); // Using demo cart ID
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
        <View style={styles.header}>
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>Your cart summary</Text>
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

        {/* Cart Summary */}
        {cartTotal && (
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
              <Text style={styles.summaryValue}>${cartTotal.total}</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Discounted Total:</Text>
              <Text style={[styles.summaryValue, styles.discountedPrice]}>
                ${cartTotal.discountedTotal}
              </Text>
            </View>

            <View style={styles.savings}>
              <Text style={styles.savingsText}>
                You save: ${(cartTotal.total - cartTotal.discountedTotal).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Polling Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Polling Information</Text>
          <Text style={styles.infoText}>
            • Updates every 15 seconds
          </Text>
          <Text style={styles.infoText}>
            • Automatically stops on mobile data
          </Text>
          <Text style={styles.infoText}>
            • Last update: {new Date().toLocaleTimeString()}
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