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

const AutomotiveScreen: React.FC = () => {
  const automotiveProducts = initialProducts.filter(
    product => product.category === 'Automotive'
  );

  const handleProductPress = (product: Product) => {
    console.log('Automotive product pressed:', product.name);
  };

  if (automotiveProducts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
         <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          <Text style={styles.emptyText}>Tidak ada produk automotive</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={automotiveProducts}
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

export default AutomotiveScreen;