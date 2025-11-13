import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from '../components/ProductCard';
import { initialProducts, Product } from '../data/initialProducts';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const categories = [
    { name: 'Elektronik', screen: 'Elektronik', icon: '📱' },
    { name: 'Fashion', screen: 'Fashion', icon: '👕' },
    { name: 'Food', screen: 'Food', icon: '🍔' },
    { name: 'Automotive', screen: 'Automotive', icon: '🚗' },
    { name: 'Baby Gear', screen: 'BabyGear', icon: '👶' },
    { name: 'Entertainment', screen: 'Entertainment', icon: '🎮' },
  ];

  const popularProducts = initialProducts.filter(product => product.isPopular);
  const newestProducts = initialProducts.filter(product => product.isNew);

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product.name);
  };

  const handleCategoryPress = (screenName: string) => {
    navigation.navigate(screenName);
  };

  // Product Card untuk horizontal list di Home
  const renderHomeProductCard = ({ item }: { item: Product }) => (
    <View style={styles.homeProductCard}>
      <ProductCard product={item} onPress={handleProductPress} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section - Ditempel ke atas */}
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang!</Text>
          <Text style={styles.subtitle}>Temukan produk terbaik untuk Anda</Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategori</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.screen)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Products Section - HORIZONTAL */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produk Populer</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={popularProducts.slice(0, 4)}
            renderItem={renderHomeProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>

        {/* New Products Section - HORIZONTAL */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produk Terbaru</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={newestProducts.slice(0, 4)}
            renderItem={renderHomeProductCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
        
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0, // ← NOLKAN untuk tempel ke atas
  },
  header: {
    padding: 20,
    paddingTop: 12, // ← Kurangi padding top
    paddingBottom: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAllText: {
    color: '#2196F3',
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  categoryText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    fontSize: 11,
  },
  horizontalListContent: {
    paddingRight: 8,
  },
  homeProductCard: {
    width: 155, // Fixed width untuk horizontal scroll
    marginRight: 12,
  },
  bottomSpace: {
    height: 20,
  },
});

export default HomeScreen;