import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';

const FoodScreen: React.FC = () => {
  const foodProducts = initialProducts.filter(
    product => product.category === 'Food'
  );

  const handleProductPress = (product: Product) => {
    console.log('Food product pressed:', product.name);
  };

  if (foodProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Tidak ada produk food</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={foodProducts}
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

export default FoodScreen;