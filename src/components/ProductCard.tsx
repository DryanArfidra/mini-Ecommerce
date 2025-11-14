import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { Product } from '../data/initialProducts';

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    if (onPress) {
      onPress(product);
    } else {
      // Default behavior: Navigate to Product Detail
      navigation.navigate('ProductDetail', { productId: product.id });
    }
  };

  // ... rest of the component remains the same
  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      {/* ... existing card content ... */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.badgeContainer}>
          {product.isNew && <Text style={[styles.badge, styles.newBadge]}>New</Text>}
          {product.isPopular && <Text style={[styles.badge, styles.popularBadge]}>Popular</Text>}
          {product.discount && <Text style={[styles.badge, styles.discountBadge]}>-{product.discount}%</Text>}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        
        <View style={styles.priceContainer}>
          {product.discount ? (
            <View style={styles.discountPriceContainer}>
              <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString('id-ID')}</Text>
              <Text style={styles.originalPrice}>Rp {product.price.toLocaleString('id-ID')}</Text>
            </View>
          ) : (
            <Text style={styles.price}>Rp {product.price.toLocaleString('id-ID')}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ... styles remain the same
const styles = StyleSheet.create({
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
    flex: 1,
    height: 220,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 45,
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
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 18,
    color: '#1a1a1a',
    flexShrink: 1,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  priceContainer: {
    marginTop: 'auto',
  },
  discountPriceContainer: {
    flexDirection: 'column',
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
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
});

export default ProductCard;