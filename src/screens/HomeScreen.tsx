import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import HomeTabsNavigator from '../navigation/HomeTabsNavigator';
import { useLocation } from '../hooks/useLocation';
import { apiMethods } from '../services/apiClient';

const HomeScreen: React.FC = () => {
  const { 
    location, 
    requestPermission, 
    getCurrentLocation,
    startPromoGeofencing 
  } = useLocation();

  const [showLocationFeatures, setShowLocationFeatures] = useState(false);

  useEffect(() => {
    // Auto request permission saat screen mount
    const initLocation = async () => {
      const granted = await requestPermission();
      if (granted) {
        console.log('✅ Izin lokasi diberikan di HomeScreen');
        
        // Kirim lokasi untuk analitik (hemat data)
        setTimeout(() => {
          sendLocationForAnalytics();
        }, 3000);
      }
    };

    initLocation();
  }, []);

  const sendLocationForAnalytics = async () => {
    try {
      const position = await getCurrentLocation();
      if (position) {
        await apiMethods.sendLocationAnalytics({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      }
    } catch (error) {
      console.warn('⚠️ Gagal mengirim lokasi analitik:', error);
    }
  };

  const handleCheckShipping = async () => {
    const position = await getCurrentLocation();
    if (position) {
      Alert.alert(
        '📍 Lokasi untuk Shipping',
        `Lokasi berhasil ditemukan!\n\nLatitude: ${position.coords.latitude.toFixed(6)}\nLongitude: ${position.coords.longitude.toFixed(6)}\nAkurasi: ${position.coords.accuracy?.toFixed(1)} meter`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleStartPromoAlert = () => {
    // Koordinat toko utama (contoh: Monas, Jakarta)
    const storeLat = -6.1754;
    const storeLon = 106.8272;
    
    startPromoGeofencing(storeLat, storeLon);
    Alert.alert(
      '🎉 Promo Alert Diaktifkan',
      'Anda akan mendapatkan notifikasi ketika berada dalam radius 100m dari Toko Utama Monas',
      [{ text: 'Mengerti' }]
    );
  };

  const handleFindNearbyStores = async () => {
    const position = await getCurrentLocation();
    if (position) {
      try {
        // Dalam implementasi nyata, ini akan navigasi ke screen toko terdekat
        const stores = await apiMethods.getNearbyStores({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        
        Alert.alert(
          '🏪 Toko Terdekat Ditemukan',
          `Menemukan ${stores.data?.length || 0} toko di sekitar Anda`,
          [{ text: 'Lihat Daftar' }]
        );
      } catch (error) {
        Alert.alert(
          'Toko Terdekat',
          'Menemukan 2 toko di sekitar Anda (demo mode)',
          [{ text: 'OK' }]
        );
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Banner Fitur Lokasi */}
      {location.latitude && (
        <View style={styles.locationBanner}>
          <Text style={styles.locationText}>
            📍 Lokasi: {location.latitude.toFixed(4)}, {location.longitude?.toFixed(4)}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowLocationFeatures(!showLocationFeatures)}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleButtonText}>
              {showLocationFeatures ? '▲' : '▼'} Fitur Lokasi
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Panel Fitur Lokasi */}
      {showLocationFeatures && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.featuresPanel}
          contentContainerStyle={styles.featuresContent}
        >
          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleFindNearbyStores}
          >
            <Text style={styles.featureEmoji}>🏪</Text>
            <Text style={styles.featureText}>Toko Terdekat</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleCheckShipping}
          >
            <Text style={styles.featureEmoji}>🚚</Text>
            <Text style={styles.featureText}>Cek Ongkir</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.featureButton}
            onPress={handleStartPromoAlert}
          >
            <Text style={styles.featureEmoji}>🎉</Text>
            <Text style={styles.featureText}>Promo Alert</Text>
          </TouchableOpacity>

          {location.error && (
            <TouchableOpacity 
              style={[styles.featureButton, styles.errorButton]}
              onPress={requestPermission}
            >
              <Text style={styles.featureEmoji}>❌</Text>
              <Text style={styles.featureText}>Minta Izin</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {/* Konten utama */}
      <View style={{ flex: 1 }}>
        <HomeTabsNavigator />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  locationBanner: {
    backgroundColor: '#007AFF',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  toggleButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuresPanel: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 80,
  },
  featuresContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  featureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginRight: 8,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  errorButton: {
    backgroundColor: '#fff5f5',
    borderColor: '#fed7d7',
  },
  featureEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;