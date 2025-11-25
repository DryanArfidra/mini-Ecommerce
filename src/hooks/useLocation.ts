import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import LocationService from '../services/LocationService';
import { GeolocationResponse, GeolocationError } from '@react-native-community/geolocation';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  loading: boolean;
  error: string | null;
}

interface UseLocationReturn {
  location: LocationState;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<GeolocationResponse | null>;
  startTracking: (onUpdate: (position: GeolocationResponse) => void) => number;
  stopTracking: (watchId: number) => void;
  startPromoGeofencing: (storeLat: number, storeLon: number) => number;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    loading: false,
    error: null,
  });

  const watchIds = useRef<number[]>([]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Hentikan semua tracking saat komponen unmount
      watchIds.current.forEach(watchId => {
        LocationService.stopLiveTracking(watchId);
      });
      watchIds.current = [];
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const granted = await LocationService.requestLocationPermission();
      
      if (!granted) {
        setLocation(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Izin lokasi ditolak' 
        }));
        
        Alert.alert(
          'Izin Lokasi Diperlukan',
          'Fitur toko terdekat membutuhkan akses lokasi. Silakan aktifkan izin lokasi di pengaturan.',
          [{ text: 'OK' }]
        );
      } else {
        setLocation(prev => ({ ...prev, loading: false }));
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Gagal meminta izin lokasi' 
      }));
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<GeolocationResponse | null> => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        return null;
      }

      const position = await LocationService.getCurrentPositionForShipping();
      
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        loading: false,
        error: null,
      });

      return position;
    } catch (error: any) {
      console.error('Error getting current location:', error);
      
      let errorMessage = 'Gagal mendapatkan lokasi';
      if (error.code === 1) errorMessage = 'Izin lokasi ditolak';
      if (error.code === 2) errorMessage = 'Lokasi tidak tersedia';
      if (error.code === 3) errorMessage = 'Timeout mendapatkan lokasi';

      setLocation(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));

      return null;
    }
  }, [requestPermission]);

  const startTracking = useCallback((onUpdate: (position: GeolocationResponse) => void): number => {
    const watchId = LocationService.startLiveTracking(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          loading: false,
          error: null,
        });
        onUpdate(position);
      },
      (error: GeolocationError) => {
        console.error('Tracking error:', error);
        setLocation(prev => ({ ...prev, error: 'Error tracking lokasi' }));
      }
    );

    watchIds.current.push(watchId);
    return watchId;
  }, []);

  const stopTracking = useCallback((watchId: number): void => {
    LocationService.stopLiveTracking(watchId);
    watchIds.current = watchIds.current.filter(id => id !== watchId);
  }, []);

  const startPromoGeofencing = useCallback((storeLat: number, storeLon: number): number => {
    const watchId = LocationService.startPromoGeofencing(storeLat, storeLon, 100);
    watchIds.current.push(watchId);
    return watchId;
  }, []);

  const calculateDistance = useCallback((
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    return LocationService.calculateDistance(lat1, lon1, lat2, lon2);
  }, []);

  return {
    location,
    requestPermission,
    getCurrentLocation,
    startTracking,
    stopTracking,
    startPromoGeofencing,
    calculateDistance,
  };
};