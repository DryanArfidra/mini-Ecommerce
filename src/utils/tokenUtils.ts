import AsyncStorage from '@react-native-async-storage/async-storage';
import KeychainService from '../services/KeychainService';

const TOKEN_KEYS = {
  EXPIRY_TIME: 'token_expiry_time',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export interface TokenData {
  accessToken: string;
  expiresAt: string;
  refreshToken?: string;
}

class TokenUtils {
  // Simpan token dengan expiry - FIXED VERSION
  async saveTokenData(tokenData: TokenData): Promise<boolean> {
    try {
      console.log('🔐 Saving token data with expiry...');
      
      // Simpan access token ke Keychain (secure)
      await KeychainService.saveAuthToken(tokenData.accessToken);
      
      // Prepare storage updates - FIXED: Use proper array type
      const storageUpdates: [string, string][] = [
        [TOKEN_KEYS.EXPIRY_TIME, tokenData.expiresAt]
      ];
      
      // Add refresh token if available
      if (tokenData.refreshToken) {
        storageUpdates.push([TOKEN_KEYS.REFRESH_TOKEN, tokenData.refreshToken]);
      }
      
      // Simpan expiry dan refresh token ke AsyncStorage
      await AsyncStorage.multiSet(storageUpdates);
      
      console.log('✅ Token data saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving token data:', error);
      throw error;
    }
  }

  // Periksa apakah token sudah expired
  async isTokenExpired(): Promise<boolean> {
    try {
      const expiryTime = await AsyncStorage.getItem(TOKEN_KEYS.EXPIRY_TIME);
      
      if (!expiryTime) {
        return true; // No expiry time means token is invalid
      }
      
      const expiryDate = new Date(expiryTime);
      const now = new Date();
      
      // Add 5 minute buffer for network requests
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      return now.getTime() >= (expiryDate.getTime() - bufferTime);
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
      return true; // Assume expired if error
    }
  }

  // Dapatkan token yang valid
  async getValidToken(): Promise<string | null> {
    try {
      const [isExpired, token] = await Promise.all([
        this.isTokenExpired(),
        KeychainService.getAuthToken()
      ]);

      if (isExpired) {
        if (token) {
          console.log('🔄 Token expired, cleaning up...');
          await this.clearTokenData();
        }
        return null;
      }

      return token;
    } catch (error) {
      console.error('❌ Error getting valid token:', error);
      return null;
    }
  }

  // Clear semua data token
  async clearTokenData(): Promise<void> {
    try {
      console.log('🧹 Clearing all token data...');
      
      await Promise.all([
        KeychainService.deleteAuthToken(),
        AsyncStorage.multiRemove([
          TOKEN_KEYS.EXPIRY_TIME,
          TOKEN_KEYS.REFRESH_TOKEN,
        ])
      ]);
      
      console.log('✅ Token data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing token data:', error);
      throw error;
    }
  }

  // Generate expiry time (contoh: 1 jam dari sekarang)
  generateExpiryTime(hours: number = 1): string {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hours);
    return expiry.toISOString();
  }

  // Get remaining token time in minutes
  async getRemainingTime(): Promise<number> {
    try {
      const expiryTime = await AsyncStorage.getItem(TOKEN_KEYS.EXPIRY_TIME);
      
      if (!expiryTime) {
        return 0;
      }
      
      const expiryDate = new Date(expiryTime);
      const now = new Date();
      const remainingMs = expiryDate.getTime() - now.getTime();
      
      return Math.max(0, Math.floor(remainingMs / (1000 * 60))); // Convert to minutes
    } catch (error) {
      console.error('❌ Error getting remaining time:', error);
      return 0;
    }
  }

  // Clear all caches (for logout)
  async clearAllCaches(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith('@cache:') || 
        key.startsWith('@product_detail') ||
        key.startsWith('wishlist_')
      );
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`✅ Cleared ${cacheKeys.length} cache items`);
      }
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
    }
  }
}

export default new TokenUtils();