import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';

const PopularScreen: React.FC = () => {
  const popularProducts = initialProducts.filter(product => product.isPopular);

  const handleProductPress = (product: Product) => {
    console.log('Popular product pressed:', product.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={popularProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20, // Extra padding untuk bottom tab
  },
});

export default PopularScreen;