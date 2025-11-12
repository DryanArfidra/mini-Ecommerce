import React, { useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Button, Text, Dimensions } from 'react-native';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import { Product } from '../types/types';
import { initialProducts } from '../data/initialProducts';

const { width } = Dimensions.get('window'); // Dapatkan lebar layar

const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mini E-Commerce</Text>
        <Button
          title="Tambah Produk"
          onPress={() => setModalVisible(true)}
        />
      </View>
      <FlatList
        data={products}
        numColumns={2} // Buat 2 kolom
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row} // Style untuk baris
      />
      <AddProductModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddProduct={handleAddProduct}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between', // Jarak antar kolom
  },
});

export default ProductListScreen;