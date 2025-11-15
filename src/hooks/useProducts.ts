// src/hooks/useProducts.ts (Updated)
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNetworkStatus } from './useNetworkStatus';

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
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const networkState = useNetworkStatus();

  const fetchProducts = async () => {
    // Check network connection before making request
    if (networkState.isInternetReachable === false) {
      setError('Anda sedang Offline. Cek koneksi Anda.');
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 7000);

    try {
      setLoading(true);
      setError(null);
      
      console.log('🟡 Fetching products from API...');
      const response = await fetch('https://dummyjson.com/products', {
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      console.log('🟢 Products fetched successfully:', data.products.length);
      setProducts(data.products);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('🟠 Fetch aborted due to timeout or unmount');
        setError('Request timeout. Please try again.');
      } else {
        console.log('🔴 Fetch error:', err.message);
        setError(err.message || 'Failed to fetch products');
      }
    } finally {
      setLoading(false);
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [networkState.isInternetReachable]);

  return { products, loading, error, refetch: fetchProducts };
};