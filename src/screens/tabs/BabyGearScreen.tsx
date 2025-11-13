import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';

const BabyGearScreen: React.FC = () => {
  const babyGearProducts = initialProducts.filter(
    product => product.category === 'Baby Gear'
  );

  const handleProductPress = (product: Product) => {
    console.log('Baby gear product pressed:', product.name);
  };

  if (babyGearProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
         <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Text style={styles.emptyText}>Tidak ada produk baby gear</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={babyGearProducts}
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

export default BabyGearScreen;