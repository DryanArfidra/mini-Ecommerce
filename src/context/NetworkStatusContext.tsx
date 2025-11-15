// src/context/NetworkStatusContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
  details: any;
}

interface NetworkStatusContextType {
  networkState: NetworkState;
  isOnline: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextType | undefined>(undefined);

export const useNetworkStatus = () => {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
};

interface NetworkStatusProviderProps {
  children: ReactNode;
}

export const NetworkStatusProvider: React.FC<NetworkStatusProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
    details: null,
  });

  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newState = {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      };

      const wasOnline = networkState.isConnected && networkState.isInternetReachable;
      const isNowOnline = newState.isConnected && newState.isInternetReachable;

      console.log('🌐 Network state changed:', {
        from: {
          connected: networkState.isConnected,
          reachable: networkState.isInternetReachable,
          type: networkState.type,
        },
        to: {
          connected: newState.isConnected,
          reachable: newState.isInternetReachable,
          type: newState.type,
        },
      });

      // Show/hide offline banner
      if (!isNowOnline && wasOnline) {
        // Went offline
        showBanner();
        console.log('📵 Koneksi terputus. Menggunakan mode offline.');
      } else if (isNowOnline && !wasOnline) {
        // Came online
        hideBanner();
        console.log('✅ Koneksi pulih. Melanjutkan operasi.');
      }

      setNetworkState(newState);
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        details: state.details,
      });

           // Show banner if initially offline
      if (!state.isConnected || !state.isInternetReachable) {
        showBanner();
      }
    });

    return () => unsubscribe();
  }, [networkState.isConnected, networkState.isInternetReachable]);

  const showBanner = () => {
    setBannerVisible(true);
    Animated.timing(bannerAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideBanner = () => {
    Animated.timing(bannerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBannerVisible(false);
    });
  };

  const bannerTranslateY = bannerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const bannerOpacity = bannerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const isOnline = Boolean(networkState.isConnected && networkState.isInternetReachable);

  const value: NetworkStatusContextType = {
    networkState,
    isOnline,
  };

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
      
      {bannerVisible && (
        <Animated.View 
          style={[
            styles.banner,
            {
              transform: [{ translateY: bannerTranslateY }],
              opacity: bannerOpacity,
            },
          ]}
        >
          <View style={[
            styles.bannerContent, 
            !isOnline ? styles.offlineBanner : styles.onlineBanner
          ]}>
            <Text style={styles.bannerText}>
              {!isOnline ? '📵 Mode Offline - Koneksi terputus' : '✅ Koneksi pulih'}
            </Text>
          </View>
        </Animated.View>
      )}
    </NetworkStatusContext.Provider>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  bannerContent: {
    padding: 12,
    paddingTop: 40, // Account for status bar
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBanner: {
    backgroundColor: '#ff6b6b',
  },
  onlineBanner: {
    backgroundColor: '#51cf66',
  },
  bannerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default NetworkStatusContext;