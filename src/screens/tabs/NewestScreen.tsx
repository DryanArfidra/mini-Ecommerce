import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts } from '../../data/initialProducts';

const NewestScreen = () => {
  // Ambil 5 produk terakhir (asumsi data terakhir adalah produk terbaru)
  const newestProducts = initialProducts.slice(-5).reverse();

  return (
    <View style={styles.container}>
      <FlatList
        data={newestProducts}
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

export default NewestScreen;