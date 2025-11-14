import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  discount?: number;
}

interface SimpleProductCardProps {
  product: Product;
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    console.log('🟢 Product pressed:', product.id, product.name);
    
    try {
      (navigation as any).navigate('ProductDetail', { 
        productId: product.id 
      });
      console.log('🟢 Navigation called successfully');
    } catch (error) {
      console.log('🔴 Navigation error:', error);
      Alert.alert('Error', 'Cannot navigate to product detail');
    }
  };

  const discountedPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        
        <View style={styles.priceContainer}>
          {product.discount ? (
            <>
              <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString()}</Text>
              <Text style={styles.originalPrice}>Rp {product.price.toLocaleString()}</Text>
            </>
          ) : (
            <Text style={styles.price}>Rp {product.price.toLocaleString()}</Text>
          )}
        </View>

        {/* Debug Info */}
        <Text style={styles.debug}>ID: {product.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  priceContainer: {
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  discountedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  debug: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});

export default SimpleProductCard;