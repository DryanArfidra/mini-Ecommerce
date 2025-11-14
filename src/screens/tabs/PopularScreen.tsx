import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  TouchableOpacity, // ✅ TAMBAH IMPORT INI
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../../components/ProductCard';
import { initialProducts, Product } from '../../data/initialProducts';
import { HomeStackParamList } from '../../navigation/HomeStackNavigator';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const PopularScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width, height } = useWindowDimensions();
  
  // ✅ RESPONSIVE COLUMNS BERDASARKAN ORIENTATION
  const isLandscape = width > height;
  const numColumns = isLandscape ? 3 : 2;
  
  const popularProducts = initialProducts.filter(product => product.isPopular);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  // ✅ DINAMIC HEADER BERDASARKAN FOCUS
  useFocusEffect(
    React.useCallback(() => {
      // Set header title saat tab aktif
      navigation.setOptions({
        title: 'Product ter Populer!',
      });

      return () => {
        // Reset header title saat tab tidak aktif
        navigation.setOptions({
          title: 'Jelajahi Produk',
        });
      };
    }, [navigation])
  );

  // ✅ TOGGLE DRAWER DARI CHILD
  const handleToggleDrawer = () => {
    const parent = navigation.getParent();
    if (parent && (parent as any).toggleDrawer) {
      (parent as any).toggleDrawer();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ TOMBOL TOGGLE DRAWER DARI CHILD */}
      <View style={styles.headerActions}>
        <Text style={styles.sectionTitle}>Produk Populer</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={handleToggleDrawer}
        >
          <Text style={styles.toggleButtonText}>☰ Toggle Drawer</Text>
        </TouchableOpacity>
      </View>

      {popularProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Tidak ada produk populer</Text>
        </View>
      ) : (
        <FlatList
          data={popularProducts}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={numColumns} // ✅ COLUMNS RESPONSIF
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          key={numColumns} // ✅ RE-RENDER SAAT COLUMNS BERUBAH
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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

export default PopularScreen;