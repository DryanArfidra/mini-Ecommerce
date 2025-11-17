import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { apiMethods } from '../services/apiClient';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  success?: boolean;
  message?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  retryCount: number;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const networkState = useNetworkStatus();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  const fetchProducts = useCallback(async (isRetry = false) => {
    // Check network connection before making request
    if (networkState.isInternetReachable === false) {
      setError('Anda sedang Offline. Cek koneksi Anda.');
      setLoading(false);
      return;
    }

    if (!isRetry) {
      setLoading(true);
      setError(null);
      setRetryCount(0);
    }

    try {
      console.log(`🟡 ${isRetry ? `Retry attempt ${retryCount + 1}` : 'Initial'} fetch products...`);
      
      const response = await apiMethods.getProducts();
      const data: ProductsResponse = response.data;
      
      console.log('🟢 Products fetched successfully:', data.products.length);
      setProducts(data.products);
      setError(null);
      setRetryCount(0);
      
    } catch (err: any) {
      console.error(`🔴 Fetch failed (attempt ${retryCount + 1}):`, err.message);
      
      const shouldRetry = 
        retryCount < maxRetries && 
        (err.code === 'ECONNABORTED' || !err.response || err.response?.status >= 500);
      
      if (shouldRetry) {
        const nextRetryCount = retryCount + 1;
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        
        console.log(`⏳ Scheduled retry ${nextRetryCount} in ${delay}ms`);
        
        setRetryCount(nextRetryCount);
        
        setTimeout(() => {
          fetchProducts(true);
        }, delay);
        
        setError(`Gagal memuat produk. Mencoba lagi... (${nextRetryCount}/${maxRetries})`);
      } else {
        setLoading(false);
        if (retryCount >= maxRetries) {
          setError('Gagal memuat produk setelah beberapa percobaan. Silakan coba lagi nanti.');
        } else {
          setError(err.userMessage || 'Gagal memuat produk. Silakan coba lagi.');
        }
      }
    } finally {
      if (!isRetry || retryCount >= maxRetries) {
        setLoading(false);
      }
    }
  }, [networkState.isInternetReachable, retryCount, maxRetries]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    retryCount,
    refetch: () => fetchProducts(),
  };
};