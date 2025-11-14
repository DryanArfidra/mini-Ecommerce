import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { initialProducts } from '../data/initialProducts';

type ProductDetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  
  const { productId } = route.params;

  console.log('🟣 ProductDetailScreen opened with ID:', productId);

  const product = initialProducts.find(p => p.id === productId);

  const handleCheckout = () => {
    navigation.navigate('Checkout', { productId: productId });
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.badgeContainer}>
          {product.isNew && <Text style={[styles.badge, styles.newBadge]}>New</Text>}
          {product.isPopular && <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>}
          {product.discount && <Text style={[styles.badge, styles.discountBadge]}>-{product.discount}%</Text>}
        </View>

        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>Category: {product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>

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

        <TouchableOpacity 
          style={styles.buyButton}
          onPress={() => Alert.alert('Success', 'Product added to cart!')}
        >
          <Text style={styles.buyButtonText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Products</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  badge: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 20,
  },
  priceContainer: {
    marginBottom: 25,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 5,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  buyButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailScreen;