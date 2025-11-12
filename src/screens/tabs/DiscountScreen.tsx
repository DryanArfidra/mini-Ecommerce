import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts } from '../../data/initialProducts';
import { Product } from '../../types/types';
import { useFocusEffect } from '@react-navigation/native';

const DiscountScreen = () => {
  // Filter produk yang memiliki diskon
  const discountProducts = initialProducts.filter((product: Product) => product.discountPercentage > 0);

  // Bukti lazy loading dan focus effect
  useFocusEffect(
    useCallback(() => {
      console.log('TAB DISKON: Sedang aktif/focus.');
      return () => {
        console.log('TAB DISKON: Sudah tidak aktif/blur.');
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={discountProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  list: { padding: 8 },
  row: { justifyContent: 'space-between' },
});

export default DiscountScreen;