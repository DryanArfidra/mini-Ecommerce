import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  value: T;
  ttl: number; // Time to live in milliseconds
  timestamp: number;
}

class CacheUtils {
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes

  // Generate cache key
  private generateKey(baseKey: string, id?: string | number): string {
    return id ? `@${baseKey}:${id}` : `@${baseKey}`;
  }

  // Set cache dengan TTL
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        value,
        ttl: ttl || this.DEFAULT_TTL,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(this.generateKey(key), JSON.stringify(cacheItem));
      console.log(`✅ Cache set for key: ${key}`);
    } catch (error) {
      console.error(`❌ Error setting cache for key ${key}:`, error);
      throw error;
    }
  }

  // Get cache dengan validasi TTL
  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(this.generateKey(key));
      
      if (!cached) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      
      // Check if cache is still valid
      if (this.isCacheValid(cacheItem)) {
        console.log(`✅ Cache hit for key: ${key}`);
        return cacheItem.value;
      } else {
        // Remove expired cache
        await this.remove(key);
        console.log(`🔄 Cache expired for key: ${key}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error getting cache for key ${key}:`, error);
      
      // Handle corrupted cache data
      if (error instanceof SyntaxError) {
        await this.remove(key);
        console.log(`🧹 Removed corrupted cache for key: ${key}`);
      }
      
      return null;
    }
  }

  // Set cache untuk product detail
  async setProductDetail(productId: number, productData: any): Promise<void> {
    await this.set(`product_detail`, productData, 10 * 60 * 1000); // 10 minutes TTL
  }

  // Get cache untuk product detail
  async getProductDetail(productId: number): Promise<any | null> {
    return await this.get(`product_detail`);
  }

  // Remove cache
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.generateKey(key));
      console.log(`✅ Cache removed for key: ${key}`);
    } catch (error) {
      console.error(`❌ Error removing cache for key ${key}:`, error);
      throw error;
    }
  }

  // Clear all cache
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('@'));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
        console.log(`✅ Cleared ${cacheKeys.length} cache items`);
      }
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
      throw error;
    }
  }

  // Check if cache is still valid
  private isCacheValid<T>(cacheItem: CacheItem<T>): boolean {
    const now = Date.now();
    return now - cacheItem.timestamp < cacheItem.ttl;
  }
}

export default new CacheUtils();