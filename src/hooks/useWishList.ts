import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEYS = {
  ITEMS: 'wishlist_items',
  COUNT: 'wishlist_count',
  UPDATED_AT: 'wishlist_updated_at',
  META: 'wishlist_meta',
} as const;

export interface WishlistItem {
  id: number;
  addedAt: string;
}

export interface WishlistMeta {
  count: number;
  updatedAt: string;
}

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearWishlist: () => Promise<void>;
}

export const useWishlist = (): UseWishlistReturn => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load wishlist data on startup
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load multiple keys in parallel
      const [itemsResult, metaResult] = await Promise.allSettled([
        AsyncStorage.getItem(WISHLIST_KEYS.ITEMS),
        AsyncStorage.getItem(WISHLIST_KEYS.META),
      ]);

      let items: WishlistItem[] = [];
      let count = 0;

      // Handle items data
      if (itemsResult.status === 'fulfilled' && itemsResult.value) {
        try {
          items = JSON.parse(itemsResult.value);
          if (!Array.isArray(items)) {
            throw new Error('Invalid wishlist data format');
          }
        } catch (parseError) {
          console.error('❌ Corrupted wishlist items, resetting...', parseError);
          await AsyncStorage.removeItem(WISHLIST_KEYS.ITEMS);
          items = [];
        }
      }

      // Handle meta data
      if (metaResult.status === 'fulfilled' && metaResult.value) {
        try {
          const meta = JSON.parse(metaResult.value);
          count = meta.count || 0;
        } catch (parseError) {
          console.error('❌ Corrupted wishlist meta, resetting...', parseError);
          await AsyncStorage.removeItem(WISHLIST_KEYS.META);
          count = items.length;
        }
      } else {
        count = items.length;
      }

      setWishlist(items);
      setWishlistCount(count);

    } catch (err: any) {
      console.error('❌ Error loading wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const saveWishlist = async (newWishlist: WishlistItem[]) => {
    try {
      const meta: WishlistMeta = {
        count: newWishlist.length,
        updatedAt: new Date().toISOString(),
      };

      // Save both items and meta in parallel using multiSet
      await AsyncStorage.multiSet([
        [WISHLIST_KEYS.ITEMS, JSON.stringify(newWishlist)],
        [WISHLIST_KEYS.META, JSON.stringify(meta)],
      ]);

      setWishlist(newWishlist);
      setWishlistCount(newWishlist.length);
      
      console.log('✅ Wishlist saved:', newWishlist.length, 'items');
    } catch (err: any) {
      console.error('❌ Error saving wishlist:', err);
      setError('Failed to save wishlist');
      throw err;
    }
  };

  const isInWishlist = useCallback((productId: number): boolean => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const addToWishlist = async (productId: number): Promise<void> => {
    try {
      if (isInWishlist(productId)) {
        return; // Already in wishlist
      }

      const newItem: WishlistItem = {
        id: productId,
        addedAt: new Date().toISOString(),
      };

      const newWishlist = [...wishlist, newItem];
      await saveWishlist(newWishlist);

    } catch (err: any) {
      console.error('❌ Error adding to wishlist:', err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<void> => {
    try {
      const newWishlist = wishlist.filter(item => item.id !== productId);
      await saveWishlist(newWishlist);
    } catch (err: any) {
      console.error('❌ Error removing from wishlist:', err);
      throw err;
    }
  };

  const toggleWishlist = async (productId: number): Promise<void> => {
    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (err: any) {
      console.error('❌ Error toggling wishlist:', err);
      throw err;
    }
  };

  const clearWishlist = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        WISHLIST_KEYS.ITEMS,
        WISHLIST_KEYS.META,
      ]);
      
      setWishlist([]);
      setWishlistCount(0);
      
      console.log('✅ Wishlist cleared');
    } catch (err: any) {
      console.error('❌ Error clearing wishlist:', err);
      throw err;
    }
  };

  return {
    wishlist,
    wishlistCount,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    loading,
    error,
    clearWishlist,
  };
};