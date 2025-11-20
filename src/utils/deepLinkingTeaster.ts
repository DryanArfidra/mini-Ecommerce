import { Linking, Alert, Platform } from 'react-native';

export const DeepLinkUtils = {
  testHome: () => {
    Linking.openURL('ecommerceapp://home');
  },
  
  testProduct: (productId: string) => {
    Linking.openURL(`ecommerceapp://produk/${productId}`);
  },
  
  testProfile: (userId: string) => {
    Linking.openURL(`ecommerceapp://profil/${userId}`);
  },
  
  testCart: () => {
    Linking.openURL('ecommerceapp://keranjang');
  },

  // Untuk testing di development
  testAllLinks: () => {
    const links = [
      'ecommerceapp://home',
      'ecommerceapp://produk/123',
      'ecommerceapp://profil/user123',
      'ecommerceapp://keranjang'
    ];
    
    links.forEach((link, index) => {
      setTimeout(() => {
        Linking.openURL(link);
      }, index * 2000);
    });
  }
};