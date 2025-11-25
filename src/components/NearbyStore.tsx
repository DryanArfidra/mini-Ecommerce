// src/components/NearbyStores.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocation } from '../hooks/useLocation';
import { apiMethods } from '../services/apiClient';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  isOpen: boolean;
}

const NearbyStores: React.FC = () => {
  const { location, requestPermission, getCurrentLocation, calculateDistance } = useLocation();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNearbyStores = async () => {
    if (!location.latitude || !location.longitude) {
      Alert.alert(
        'Lokasi Tidak Tersedia',
        'Tidak dapat menemukan lokasi Anda. Pastikan GPS aktif dan izin lokasi diberikan.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      // Dalam implementasi nyata, ini akan memanggil API
      // Untuk demo, kita gunakan data mock
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Toko Utama',
          address: 'Jl. Merdeka No. 123',
          distance: calculateDistance(
            location.latitude!,
            location.longitude!,
            -6.2088,
            106.8456
          ),
          latitude: -6.2088,
          longitude: 106.8456,
          isOpen: true,
        },
        {
          id: '2',
          name: 'Toko Cabang Senayan',
          address: 'Jl. Senayan Raya No. 45',
          distance: calculateDistance(
            location.latitude!,
            location.longitude!,
            -6.2275,
            106.8004
          ),
          latitude: -6.2275,
          longitude: 106.8004,
          isOpen: true,
        },
      ];

      // Urutkan berdasarkan jarak terdekat
      const sortedStores = mockStores.sort((a, b) => a.distance - b.distance);
      setStores(sortedStores);
    } catch (error) {
      console.error('Error loading nearby stores:', error);
      Alert.alert('Error', 'Gagal memuat toko terdekat');
    } finally {
      setLoading(false);
    }
  };

  const handleStorePress = (store: Store) => {
    Alert.alert(
      store.name,
      `Jarak: ${store.distance.toFixed(0)} meter\n${store.address}`,
      [
        { text: 'Tutup' },
        { 
          text: 'Lihat Rute', 
          onPress: () => {
            // Implementasi navigasi ke maps
            console.log('Navigasi ke:', store);
          }
        },
      ]
    );
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity 
      style={styles.storeItem}
      onPress={() => handleStorePress(item)}
    >
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{item.name}</Text>
        <Text style={styles.storeAddress}>{item.address}</Text>
        <Text style={styles.storeDistance}>
          📍 {item.distance.toFixed(0)} meter
        </Text>
      </View>
      <View style={[
        styles.statusIndicator,
        item.isOpen ? styles.open : styles.closed
      ]}>
        <Text style={styles.statusText}>
          {item.isOpen ? 'BUKA' : 'TUTUP'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Toko Terdekat</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadNearbyStores}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.refreshText}>Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      {location.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{location.error}</Text>
          <TouchableOpacity 
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Minta Izin Lokasi</Text>
          </TouchableOpacity>
        </View>
      )}

      {!location.latitude && !location.loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Tekan refresh untuk menemukan toko terdekat
          </Text>
        </View>
      )}

      {location.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Mencari toko terdekat...</Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: 'white',
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  storeItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  storeDistance: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  open: {
    backgroundColor: '#e8f5e8',
  },
  closed: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NearbyStores;