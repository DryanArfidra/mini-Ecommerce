import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts } from '../../data/initialProducts';
import { Product } from '../../types/types';

const PopularScreen = () => {
  const popularProducts = initialProducts.filter((product: Product) => product.isPopular);

  return (
    // PASTIKAN VIEW UTAMA MEMILIKI STYLE INI
    <View style={styles.container}>
      <FlatList
        data={popularProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        // Tambahkan prop ini untuk mencegah 'bouncing' di iOS
        bounces={false} 
      />
    </View>
  );
};

// PASTIKAN STYLE INI ADA DAN BENAR
const styles = StyleSheet.create({
  container: {
    flex: 1,        // <-- INI ADALAH KUNCI UTAMANYA
    backgroundColor: '#f0f2f5',
  },
  list: {
    padding: 8,     // Padding untuk seluruh list
  },
  row: {
    justifyContent: 'space-between', // Jarak antar kolom
  },
});

export default PopularScreen;