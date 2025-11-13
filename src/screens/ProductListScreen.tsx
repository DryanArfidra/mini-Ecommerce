import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import { initialProducts, Product } from '../data/initialProducts';

interface ProductListScreenProps {
  navigation: any;
}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ navigation }) => {
  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
  };

  // Product Card untuk grid 2 kolom
  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard product={item} onPress={handleProductPress} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2} // ← 2 KOLOM
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#edebebff',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1d4d4ff',
  },
  searchInput: {
    backgroundColor: '#f6ebebff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#efeaeaff',
  },
  listContent: {
    padding: 6,
    paddingBottom: 20,
  },
  productCardWrapper: {
    width: '50%', // ← 2 kolom
    padding: 3,
  },
});

export default ProductListScreen;