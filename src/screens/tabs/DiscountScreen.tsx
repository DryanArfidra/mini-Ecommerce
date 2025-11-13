import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';

const DiscountScreen: React.FC = () => {
  const isFocused = useIsFocused();
  const discountProducts = initialProducts.filter(product => product.discount);

  const handleProductPress = (product: Product) => {
    console.log('Discount product pressed:', product.name);
  };

  // Lazy loading effect
  useEffect(() => {
    if (isFocused) {
      console.log('🔄 Tab Diskon: DIFOKUS - Memuat konten...');
      
      // Simulate data loading
      return () => {
        console.log('🧹 Tab Diskon: DITINGGALKAN - Membersihkan...');
      };
    }
  }, [isFocused]);

  if (discountProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada produk diskon</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={discountProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default DiscountScreen;