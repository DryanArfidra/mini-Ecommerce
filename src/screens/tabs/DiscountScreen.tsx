import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const DiscountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused(); // ✅ DETEKSI FOCUS TAB
  
  const discountProducts = initialProducts.filter(product => 
    product.discount && product.discount > 0
  );

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  // ✅ OPTIMASI: LAZY LOADING DENGAN FOCUS EFFECT
  useEffect(() => {
    if (isFocused) {
      console.log('🔄 Tab Diskon: DI-LOAD (sedang aktif)');
      // Lakukan preload data atau operasi lainnya di sini
    }

    return () => {
      console.log('🧹 Tab Diskon: DI-BERSIHKAN (tidak aktif)');
      // Cleanup effect ketika tab tidak aktif
    };
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {discountProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tidak ada produk diskon</Text>
        </View>
      ) : (
        <FlatList
          data={discountProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
          )}
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
  listContent: {
    padding: 8,
    paddingBottom: 20,
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

export default DiscountScreen;