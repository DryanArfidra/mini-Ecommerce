import * as Keychain from 'react-native-keychain';

// Service names for namespace isolation
export const KeychainServices = {
  USER_TOKEN: 'com.ecom:userToken',
  API_KEY: 'com.ecom:apiKey',
} as const;

export interface KeychainCredentials {
  username: string;
  password: string;
  service: string;
}

class KeychainService {
  // Save authentication token
  async saveAuthToken(token: string): Promise<boolean> {
    try {
      console.log('🔐 Saving auth token to Keychain...');
      const result = await Keychain.setGenericPassword(
        'auth_token', // username
        token,        // password (our token)
        { service: KeychainServices.USER_TOKEN }
      );
      
      if (result === false) {
        throw new Error('Failed to save token to Keychain');
      }
      
      console.log('✅ Auth token saved to Keychain successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving auth token to Keychain:', error);
      throw error;
    }
  }

  // Get authentication token
  async getAuthToken(): Promise<string | null> {
    try {
      console.log('🔐 Retrieving auth token from Keychain...');
      const credentials = await Keychain.getGenericPassword({
        service: KeychainServices.USER_TOKEN,
      });
      
      if (credentials) {
        console.log('✅ Auth token retrieved from Keychain');
        return credentials.password; // token is stored as password
      }
      
      console.log('ℹ️ No auth token found in Keychain');
      return null;
    } catch (error: any) {
      console.error('❌ Error retrieving auth token from Keychain:', error);
      
      // Handle specific access denied errors
      if (error.message?.includes('access denied') || 
          error.message?.includes('security') ||
          error.code === 'E_KEYCHAIN_ACCESS_DENIED') {
        throw new Error('ACCESS_DENIED: Device security changed, please login again.');
      }
      
      throw error;
    }
  }

  // Delete authentication token
  async deleteAuthToken(): Promise<boolean> {
    try {
      console.log('🔐 Deleting auth token from Keychain...');
      const result = await Keychain.resetGenericPassword({
        service: KeychainServices.USER_TOKEN,
      });
      
      console.log('✅ Auth token deleted from Keychain');
      return result;
    } catch (error) {
      console.error('❌ Error deleting auth token from Keychain:', error);
      throw error;
    }
  }

  // Save API Key
  async saveApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('🔐 Saving API key to Keychain...');
      const result = await Keychain.setGenericPassword(
        'api_client', // static username
        apiKey,       // API key as password
        { service: KeychainServices.API_KEY }
      );
      
      if (result === false) {
        throw new Error('Failed to save API key to Keychain');
      }
      
      console.log('✅ API key saved to Keychain successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving API key to Keychain:', error);
      throw error;
    }
  }

  // Get API Key
  async getApiKey(): Promise<string | null> {
    try {
      console.log('🔐 Retrieving API key from Keychain...');
      const credentials = await Keychain.getGenericPassword({
        service: KeychainServices.API_KEY,
      });
      
      if (credentials) {
        console.log('✅ API key retrieved from Keychain');
        return credentials.password;
      }
      
      console.log('ℹ️ No API key found in Keychain');
      return null;
    } catch (error: any) {
      console.error('❌ Error retrieving API key from Keychain:', error);
      
      if (error.message?.includes('access denied') || 
          error.message?.includes('security') ||
          error.code === 'E_KEYCHAIN_ACCESS_DENIED') {
        throw new Error('ACCESS_DENIED: Cannot access secure storage.');
      }
      
      throw error;
    }
  }

  // Delete API Key
  async deleteApiKey(): Promise<boolean> {
    try {
      console.log('🔐 Deleting API key from Keychain...');
      const result = await Keychain.resetGenericPassword({
        service: KeychainServices.API_KEY,
      });
      
      console.log('✅ API key deleted from Keychain');
      return result;
    } catch (error) {
      console.error('❌ Error deleting API key from Keychain:', error);
      throw error;
    }
  }

  // Clean all secure data (for logout)
  async cleanAllSecureData(): Promise<void> {
    try {
      console.log('🧹 Cleaning all secure data from Keychain...');
      
      await Promise.all([
        this.deleteAuthToken(),
        this.deleteApiKey(),
      ]);
      
      console.log('✅ All secure data cleaned from Keychain');
    } catch (error) {
      console.error('❌ Error cleaning secure data from Keychain:', error);
      throw error;
    }
  }
}

export default new KeychainService();