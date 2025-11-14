import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type AddProductScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const categories = [
    'Elektronik',
    'Fashion',
    'Food',
    'Automotive',
    'Baby Gear',
    'Entertainment',
  ];

  const handleAddProduct = () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Harap isi semua field yang wajib');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price: parseInt(price),
      category,
      description,
      image: image || 'https://via.placeholder.com/300',
      isNew: true,
      isPopular: Math.random() > 0.5,
      discount: Math.random() > 0.7 ? 10 : undefined,
    };

    console.log('🟢 Product added:', newProduct);
    
    Alert.alert(
      'Success', 
      'Produk berhasil ditambahkan!',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setPrice('');
            setCategory('');
            setDescription('');
            setImage('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleDemoData = () => {
    setName('Smartphone Android Terbaru');
    setPrice('2500000');
    setCategory('Elektronik');
    setDescription('Smartphone dengan fitur terkini dan kamera high resolution');
    setImage('https://via.placeholder.com/300');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Tambah Produk Baru</Text>
          <Text style={styles.subtitle}>Isi form untuk menambah produk ke katalog</Text>
        </View>

        <View style={styles.form}>
          {/* Preview Image */}
          {image ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <Text style={styles.previewText}>Preview Gambar</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Nama Produk *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Masukkan nama produk"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Harga *</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Masukkan harga (contoh: 150000)"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Kategori *</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesScroll}
          >
            <View style={styles.categoriesContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.selectedCategory,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat && styles.selectedCategoryText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.selectedCategoryText}>
            {category ? `Kategori terpilih: ${category}` : 'Pilih kategori'}
          </Text>

          <Text style={styles.label}>Deskripsi Produk</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Masukkan deskripsi produk..."
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />

          <Text style={styles.label}>URL Gambar Produk</Text>
          <TextInput
            style={styles.input}
            value={image}
            onChangeText={setImage}
            placeholder="https://example.com/image.jpg (opsional)"
            placeholderTextColor="#999"
          />

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={handleDemoData}
          >
            <Text style={styles.demoButtonText}>Isi Data Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.addButton, (!name || !price || !category) && styles.disabledButton]}
            onPress={handleAddProduct}
            disabled={!name || !price || !category}
          >
            <Text style={styles.addButtonText}>➕ Tambah Produk</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 20,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  previewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
  },
  categoriesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  demoButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddProductScreen;