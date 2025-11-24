import * as Keychain from 'react-native-keychain';
import * as LocalAuthentication from 'react-native-local-authentication';

// Service names for namespace isolation
export const KeychainServices = {
  USER_TOKEN: 'com.ecom:userToken',
  API_KEY: 'com.ecom:apiKey',
  BIOMETRIC_CREDENTIALS: 'com.ecom:biometricCredentials',
} as const;

export interface KeychainCredentials {
  username: string;
  password: string;
  service: string;
}

export interface BiometricConfig {
  accessControl?: Keychain.ACCESS_CONTROL[];
  accessible?: Keychain.ACCESSIBLE;
}

class KeychainService {
  // === BIOMETRIC METHODS ===
  
  // Check sensor availability
  async isSensorAvailable(): Promise<{
    available: boolean;
    biometryType?: string;
    error?: string;
  }> {
    try {
      const result = await LocalAuthentication.isSensorAvailable();
      console.log('🔍 Biometric sensor check:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error checking biometric sensor:', error);
      return {
        available: false,
        error: error.message
      };
    }
  }

  // Save credentials with biometric protection
  async saveCredentialsWithBiometric(
    username: string, 
    password: string, 
    service: string = KeychainServices.BIOMETRIC_CREDENTIALS
  ): Promise<boolean> {
    try {
      console.log('🔐 Saving credentials with biometric protection...');
      
      const result = await Keychain.setGenericPassword(username, password, {
        service,
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      
      if (result === false) {
        throw new Error('Failed to save biometric credentials');
      }
      
      console.log('✅ Biometric credentials saved successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Error saving biometric credentials:', error);
      
      // Handle specific biometric errors
      if (error.message?.includes('BIOMETRY_NOT_ENROLLED')) {
        throw new Error('BIOMETRY_NOT_ENROLLED: User has not enrolled biometrics');
      }
      
      if (error.message?.includes('BIOMETRY_NOT_AVAILABLE')) {
        throw new Error('BIOMETRY_NOT_AVAILABLE: Biometric hardware not available');
      }
      
      if (error.message?.includes('BIOMETRY_LOCKOUT')) {
        throw new Error('BIOMETRY_LOCKOUT: Biometric sensor locked due to too many failed attempts');
      }
      
      throw error;
    }
  }

  // Get credentials with biometric prompt
  async getCredentialsWithBiometric(
    promptMessage: string = 'Authenticate to access your account',
    service: string = KeychainServices.BIOMETRIC_CREDENTIALS
  ): Promise<{ username: string; password: string } | null> {
    try {
      console.log('🔐 Retrieving credentials with biometric...');
      
      const credentials = await Keychain.getGenericPassword({
        service,
        authenticationPrompt: {
          title: 'Biometric Authentication',
          subtitle: 'Secure Access',
          description: promptMessage,
          cancel: 'Cancel',
        },
        // Remove authenticationType as it's not in GetOptions type
      });
      
      if (credentials) {
        console.log('✅ Biometric authentication successful');
        return credentials;
      }
      
      console.log('ℹ️ No biometric credentials found');
      return null;
    } catch (error: any) {
      console.error('❌ Biometric authentication failed:', error);
      
      // Handle specific biometric errors
      if (error.message?.includes('BIOMETRY_NOT_ENROLLED')) {
        throw new Error('BIOMETRY_NOT_ENROLLED');
      }
      
      if (error.message?.includes('BIOMETRY_LOCKOUT')) {
        throw new Error('BIOMETRY_LOCKOUT');
      }
      
      if (error.message?.includes('USER_CANCEL') || error.message?.includes('AUTHENTICATION_CANCELED')) {
        throw new Error('AUTHENTICATION_CANCELED');
      }
      
      throw error;
    }
  }

  // Simple biometric prompt (for transactions)
  async simplePrompt(
    promptMessage: string = 'Authenticate to continue',
    fallbackToPasscode: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔐 Starting biometric prompt...');
      
      const result = await LocalAuthentication.authenticate({
        promptMessage,
        fallbackToPasscode,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      
      console.log('🔐 Biometric prompt result:', result);
      
      if (result.success) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.error || 'Authentication failed' 
        };
      }
    } catch (error: any) {
      console.error('❌ Biometric prompt error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // Check if biometric credentials exist
  async hasBiometricCredentials(): Promise<boolean> {
    try {
      const credentials = await this.getCredentialsWithBiometric();
      return credentials !== null;
    } catch (error) {
      return false;
    }
  }

  // Delete biometric credentials
  async deleteBiometricCredentials(): Promise<boolean> {
    try {
      console.log('🔐 Deleting biometric credentials...');
      const result = await Keychain.resetGenericPassword({
        service: KeychainServices.BIOMETRIC_CREDENTIALS,
      });
      
      console.log('✅ Biometric credentials deleted');
      return result;
    } catch (error) {
      console.error('❌ Error deleting biometric credentials:', error);
      throw error;
    }
  }

  // === EXISTING METHODS ===
  
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
      
      await Promise.allSettled([
        this.deleteAuthToken(),
        this.deleteApiKey(),
        this.deleteBiometricCredentials(),
      ]);
      
      console.log('✅ All secure data cleaned from Keychain');
    } catch (error) {
      console.error('❌ Error cleaning secure data from Keychain:', error);
      throw error;
    }
  }
} 

export default new KeychainService();