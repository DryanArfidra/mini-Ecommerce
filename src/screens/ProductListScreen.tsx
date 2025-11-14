import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProductStackParamList } from '../navigation/ProductStackNavigator'; 
import { initialProducts, Product } from '../data/initialProducts';

type ProductListScreenNavigationProp = NativeStackNavigationProp<ProductStackParamList, 'ProductList'>;

const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const [products] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductPress = (product: Product) => {
    console.log('🟢 Navigating to ProductDetail from ProductList:', product.id);
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddProduct = () => {
    console.log('🟢 Navigating to AddProduct from ProductList');
    navigation.navigate('AddProduct');
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const discountedPrice = product.discount 
      ? product.price - (product.price * product.discount / 100)
      : product.price;

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleProductPress(product)}
      >
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.badgeContainer}>
          {product.isNew && <Text style={[styles.badge, styles.newBadge]}>New</Text>}
          {product.isPopular && <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>}
          {product.discount && <Text style={[styles.badge, styles.discountBadge]}>-{product.discount}%</Text>}
        </View>

        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        
        <View style={styles.priceContainer}>
          {product.discount ? (
            <>
              <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString('id-ID')}</Text>
              <Text style={styles.originalPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
            </>
          ) : (
            <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
          )}
        </View>

      </TouchableOpacity>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.productCardWrapper}>
      <ProductCard product={item} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.resultCount}>
          {filteredProducts.length} products found
        </Text>
      </View>

      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try different keywords</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 8,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
  },
  productCardWrapper: {
    width: '50%',
    padding: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 260, 
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    overflow: 'hidden',
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  popularBadge: {
    backgroundColor: '#FF9800',
    color: 'white',
  },
  discountBadge: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 18,
    color: '#1a1a1a',
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    marginTop: 'auto',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2196F3',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2196F3',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  debugText: {
    fontSize: 10,
    color: '#2196F3',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default ProductListScreen;