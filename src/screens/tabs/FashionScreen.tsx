import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';

const FashionScreen: React.FC = () => {
  const fashionProducts = initialProducts.filter(
    product => product.category === 'Fashion'
  );

  const handleProductPress = (product: Product) => {
    console.log('Fashion product pressed:', product.name);
  };

  if (fashionProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada produk fashion</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fashionProducts}
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

export default FashionScreen;