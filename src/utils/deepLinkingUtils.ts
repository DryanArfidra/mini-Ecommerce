import { Linking, Alert, Platform } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/AppNavigator';

// Extend RootStackParamList untuk include semua routes
type AppNavigationProp = NavigationProp<RootStackParamList>;

// Test utility functions
export const DeepLinkUtils = {
  testHome: () => {
    Linking.openURL('miniecom://home');
  },
  
  testProduct: (productId: string) => {
    Linking.openURL(`miniecom://product/${productId}`);
  },
  
  testProfile: (userId: string) => {
    Linking.openURL(`miniecom://profile/${userId}`);
  },
  
  testCart: () => {
    Linking.openURL('miniecom://cart');
  },

  testAddToCart: (productId: string) => {
    Linking.openURL(`miniecom://add-to-cart/${productId}`);
  },

  testCheckout: () => {
    Linking.openURL('miniecom://checkout');
  },

  // Untuk testing di development
  testAllLinks: () => {
    const links = [
      'miniecom://home',
      'miniecom://product/123',
      'miniecom://profile/user123',
      'miniecom://cart',
      'miniecom://add-to-cart/55',
      'miniecom://checkout'
    ];
    
    links.forEach((link, index) => {
      setTimeout(() => {
        Linking.openURL(link);
        console.log(`🔗 Testing deep link: ${link}`);
      }, index * 2000);
    });
  }
};

// Hook untuk handle deep linking dengan auth dan validation
export const useDeepLinking = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { isAuthenticated } = useAuth();

  const handleDeepLink = (url: string) => {
    console.log('🔗 Handling deep link:', url);
    
    try {
      // Remove protocol and parse
      const cleanUrl = url.replace(/miniecom:\/\//, '');
      const [host, ...pathParts] = cleanUrl.split('/');
      const path = pathParts.join('/');
      
      console.log('📋 Parsed deep link:', { host, path });
      
      // Handle different deep link types
      switch (host) {
        case 'add-to-cart':
          handleAddToCart(path);
          break;
          
        case 'product':
          handleProductDetail(path);
          break;
          
        case 'cart':
          handleCart();
          break;

        case 'checkout':
          handleCheckout();
          break;
          
        case 'home':
          handleHome();
          break;
          
        default:
          console.log('❌ Unknown deep link host:', host);
          handleUnknownLink();
      }
    } catch (error) {
      console.error('❌ Error parsing deep link:', error);
      handleInvalidLink();
    }
  };

  const handleAddToCart = (productId: string) => {
    console.log('🛒 Add to cart deep link:', productId);
    
    // Validasi productId
    if (!productId || isNaN(Number(productId))) {
      Alert.alert(
        'Invalid Product', 
        'The product ID is invalid. Redirecting to home.',
        [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
      );
      return;
    }
    
    if (!isAuthenticated) {
      // Save the pending deep link action
      savePendingAction(`miniecom://add-to-cart/${productId}`);
      
      // Redirect ke login dengan callback
      Alert.alert(
        'Login Required',
        'Please login to add items to cart',
        [
          { 
            text: 'Login', 
            onPress: () => {
              navigation.navigate('Login', { callback: `miniecom://add-to-cart/${productId}` });
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }
    
    // Implement add to cart logic here
    console.log(`🛒 Adding product ${productId} to cart via deep link`);
    
    // Simulate adding to cart
    Alert.alert(
      'Success', 
      `Product ${productId} added to cart!`,
      [{ text: 'OK', onPress: () => navigation.navigate('Cart') }]
    );
  };

  const handleProductDetail = (productId: string) => {
    console.log('📱 Product detail deep link:', productId);
    
    // Validasi productId
    if (!productId || isNaN(Number(productId))) {
      Alert.alert(
        'Invalid Link', 
        'The product link is invalid. Redirecting to home.',
        [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
      );
      return;
    }
    
    if (!isAuthenticated) {
      // Save the pending deep link action
      savePendingAction(`miniecom://product/${productId}`);
      
      // Redirect ke login dengan callback
      navigation.navigate('Login', { callback: `miniecom://product/${productId}` });
      return;
    }
    
    // Navigate to product detail dengan type safety
    navigation.navigate('ProductDetail', { productId });
  };

  const handleCart = () => {
    console.log('🛒 Cart deep link');
    
    if (!isAuthenticated) {
      // Save the pending deep link action
      savePendingAction('miniecom://cart');
      
      // Redirect ke login dengan callback
      navigation.navigate('Login', { callback: 'miniecom://cart' });
      return;
    }
    
    navigation.navigate('Cart');
  };

  const handleCheckout = () => {
    console.log('💰 Checkout deep link');
    
    if (!isAuthenticated) {
      // Save the pending deep link action
      savePendingAction('miniecom://checkout');
      
      Alert.alert(
        'Login Required',
        'Please login to proceed to checkout',
        [
          { 
            text: 'Login', 
            onPress: () => navigation.navigate('Login', { callback: 'miniecom://checkout' })
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }
    
    navigation.navigate('Checkout', { productId: undefined });
  };

  const handleHome = () => {
    console.log('🏠 Home deep link');
    navigation.navigate('Main');
  };

  const handleUnknownLink = () => {
    Alert.alert(
      'Unknown Link', 
      'This link is not supported. Redirecting to home.',
      [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
    );
  };

  const handleInvalidLink = () => {
    Alert.alert(
      'Invalid Link', 
      'The link is invalid or malformed. Redirecting to home.',
      [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
    );
  };

  // Save pending deep link action for after login
  const savePendingAction = async (url: string) => {
    try {
      await AsyncStorage.setItem('pending_deep_link', url);
      console.log('💾 Saved pending deep link:', url);
    } catch (error) {
      console.error('❌ Error saving pending deep link:', error);
    }
  };

  // Get and execute pending deep link action after login
  const executePendingAction = async (): Promise<boolean> => {
    try {
      const pendingUrl = await AsyncStorage.getItem('pending_deep_link');
      if (pendingUrl) {
        console.log('🚀 Executing pending deep link:', pendingUrl);
        await AsyncStorage.removeItem('pending_deep_link');
        handleDeepLink(pendingUrl);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error executing pending action:', error);
      return false;
    }
  };

  // Initialize deep linking listeners
  const initializeDeepLinking = () => {
    const handleUrl = ({ url }: { url: string }) => {
      handleDeepLink(url);
    };

    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleUrl);

    // Check initial URL if app was opened from deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('🔗 App opened with deep link:', url);
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  };

  return {
    handleDeepLink,
    executePendingAction,
    initializeDeepLinking,
  };
};

// Utility untuk validasi deep link parameters
export const DeepLinkValidator = {
  isValidProductId: (productId: string): boolean => {
    return !!(productId && !isNaN(Number(productId)) && Number(productId) > 0);
  },
  
  isValidUserId: (userId: string): boolean => {
    return !!(userId && userId.length > 0);
  },
  
  parseProductId: (productId: string): number | null => {
    const id = parseInt(productId);
    return !isNaN(id) && id > 0 ? id : null;
  }
};