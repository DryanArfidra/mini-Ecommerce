import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'; // Impor Dimensions
import { Product } from '../types/types';
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Ambil lebar layar sekali saja
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.card, { width: screenWidth / 2 - 12 }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          Rp {product.price.toLocaleString('id-ID')}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    // Margin dihapus, karena jarak sudah diatur oleh columnWrapperStyle di FlatList
    marginVertical: 4,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: {
    width: '100%',
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default ProductCard;