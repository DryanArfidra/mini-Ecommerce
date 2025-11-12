import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../components/ProductCard';
import { initialProducts } from '../../data/initialProducts';

const EntertainmentScreen = () => {
  const entertainmentProducts = initialProducts.filter(p => p.category === 'Hiburan');

  return (
    <View style={styles.container}>
      <FlatList
        data={entertainmentProducts}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  list: { padding: 8 },
  row: { justifyContent: 'space-between' },
});

export default EntertainmentScreen;