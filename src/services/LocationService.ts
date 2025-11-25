import { PermissionsAndroid, Platform, Alert } from 'react-native';
import Geolocation, { 
  GeolocationResponse, 
  GeolocationError,
  GeolocationOptions 
} from '@react-native-community/geolocation';


class LocationService {
  private static instance: LocationService;

  private constructor() {
    // Configure Geolocation
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * 1. Izin Lokasi dengan Penjelasan (Rationale)
   * Fitur pencari "Toko Terdekat" butuh izin lokasi
   */
  async requestLocationPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true; // Untuk iOS, handle dengan permissions iOS nanti
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Izin Akses Lokasi',
          message: 'Kami butuh lokasi Anda untuk menampilkan toko terdekat secara akurat.',
          buttonNeutral: 'Tanya Nanti',
          buttonNegative: 'Tolak',
          buttonPositive: 'Izinkan',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ Izin lokasi diberikan');
        return true;
      } else {
        console.log('❌ Izin lokasi ditolak');
        return false;
      }
    } catch (error) {
      console.error('❌ Error meminta izin lokasi:', error);
      return false;
    }
  }

  /**
   * 2. Optimasi Baterai (One-Time Fetch)
   * Hitung ongkir otomatis saat checkout
   */
  async getCurrentPositionForShipping(): Promise<GeolocationResponse> {
    return new Promise((resolve, reject) => {
      const options: GeolocationOptions = {
        enableHighAccuracy: true, // Agar akurat untuk hitung ongkir
        timeout: 10000, // 10 detik batas waktu
        maximumAge: 60000, // Gunakan cache jika umur lokasi < 1 menit
      };

      Geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Lokasi berhasil didapat untuk shipping:', position);
          resolve(position);
        },
        (error: GeolocationError) => {
          console.error('❌ Error mendapatkan lokasi:', error);

          if (error.code === 3) { // TIMEOUT error
            Alert.alert(
              'GPS Timeout',
              'Periksa koneksi GPS Anda. Pastikan GPS aktif dan berada di area terbuka.',
              [{ text: 'OK' }]
            );
          }

          reject(error);
        },
        options
      );
    });
  }

  /**
   * 3. Live Tracking & Cleanup
   * Fitur navigasi kurir - update setiap 20 meter
   */
  startLiveTracking(
    onPositionUpdate: (position: GeolocationResponse) => void,
    onError?: (error: GeolocationError) => void
  ): number {
    const watchId = Geolocation.watchPosition(
      (position) => {
        console.log('🚚 Update posisi kurir:', position);
        onPositionUpdate(position);
      },
      (error) => {
        console.error('❌ Error live tracking:', error);
        onError?.(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 20, // Update setiap 20 meter
        interval: 5000, // Interval minimum 5 detik
        fastestInterval: 2000,
      }
    );

    return watchId;
  }

  stopLiveTracking(watchId: number): void {
    Geolocation.clearWatch(watchId);
    console.log('🛑 Live tracking dihentikan');
  }

  /**
   * 4. Integrasi Networking Hemat Data
   * Kirim lokasi user ke server untuk analitik, tapi jangan spam server
   */
  async getLocationForAnalytics(): Promise<GeolocationResponse | null> {
    return new Promise((resolve) => {
      const options: GeolocationOptions = {
        enableHighAccuracy: false, // Tidak perlu akurat untuk analitik
        timeout: 5000,
        maximumAge: 120000, // 2 menit - menggunakan cache lokasi yang masih segar
      };

      Geolocation.getCurrentPosition(
        (position) => {
          console.log('📊 Lokasi untuk analitik:', position);
          resolve(position);
        },
        (error) => {
          console.warn('⚠️ Gagal mendapatkan lokasi untuk analitik:', error);
          resolve(null); // Jangan reject, karena analitik tidak kritis
        },
        options
      );
    });
  }

  /**
   * 5. Geofencing Sederhana (Promo Radius)
   * Hitung jarak antara dua titik koordinat
   */
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Radius bumi dalam km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Convert ke meter
    
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Geofencing untuk promo toko
   */
  startPromoGeofencing(
    storeLat: number,
    storeLon: number,
    radiusMeters: number = 100
  ): number {
    let watchId: number;

    const checkDistance = (position: GeolocationResponse) => {
      const { latitude, longitude } = position.coords;
      const distance = this.calculateDistance(
        latitude, 
        longitude, 
        storeLat, 
        storeLon
      );

      console.log(`📏 Jarak ke toko: ${distance.toFixed(1)} meter`);

      if (distance < radiusMeters) {
        Alert.alert(
          '🎉 PROMO DEKAT TOKO!',
          `Anda berada ${distance.toFixed(0)} meter dari Toko Utama! Dapatkan diskon spesial!`,
          [{ text: 'Lihat Promo', onPress: () => this.onPromoAlertPressed() }]
        );
        
        // Matikan tracking setelah promo muncul
        this.stopLiveTracking(watchId);
      }
    };

    watchId = this.startLiveTracking(checkDistance, (error) => {
      console.error('❌ Error geofencing:', error);
    });

    return watchId;
  }

  private onPromoAlertPressed(): void {
    // Navigasi ke halaman promo
    console.log('🔗 User menekan notifikasi promo');
    // Implementasi navigasi ke halaman promo
  }
}

export default LocationService.getInstance();