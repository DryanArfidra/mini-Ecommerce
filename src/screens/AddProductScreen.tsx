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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

type AddProductScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

interface SelectedAsset {
  uri: string;
  fileName?: string;
  type?: string;
}

const AddProductScreen: React.FC = () => {
  const navigation = useNavigation<AddProductScreenNavigationProp>();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedAsset[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Elektronik',
    'Fashion',
    'Food',
    'Automotive',
    'Baby Gear',
    'Entertainment',
  ];

  // a. Seleksi Multi-Foto dengan Optimasi
  const handleSelectImages = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5, // Maksimal 5 foto
        maxWidth: 600,    // Optimasi ukuran
        maxHeight: 600,   // Optimasi ukuran
        quality: 0.8,
        includeExtra: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newAssets: SelectedAsset[] = result.assets.map(asset => ({
          uri: asset.uri!,
          fileName: asset.fileName,
          type: asset.type,
        }));

        setSelectedImages(prev => [...prev, ...newAssets].slice(0, 5)); // Batasi maksimal 5
        
        // Simpan ke AsyncStorage
        await AsyncStorage.setItem('@ecom:newProductAssets', JSON.stringify([
          ...selectedImages,
          ...newAssets
        ].slice(0, 5)));
        
        Alert.alert('Success', `${newAssets.length} foto berhasil dipilih`);
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'Gagal memilih foto');
    }
  };

  const removeImage = async (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    await AsyncStorage.setItem('@ecom:newProductAssets', JSON.stringify(newImages));
  };

  const handleAddProduct = async () => {
    if (!name || !price || !category) {
      Alert.alert('Error', 'Harap isi semua field yang wajib');
      return;
    }

    setUploading(true);

    try {
      const newProduct = {
        id: Date.now().toString(),
        name,
        price: parseInt(price),
        category,
        description,
        images: selectedImages,
        isNew: true,
        isPopular: Math.random() > 0.5,
        discount: Math.random() > 0.7 ? 10 : undefined,
      };

      console.log('🟢 Product added:', newProduct);
      
      // Clear stored images after successful product creation
      await AsyncStorage.removeItem('@ecom:newProductAssets');
      
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
              setSelectedImages([]);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal menambahkan produk');
    } finally {
      setUploading(false);
    }
  };

  const handleDemoData = () => {
    setName('Smartphone Android Terbaru');
    setPrice('2500000');
    setCategory('Elektronik');
    setDescription('Smartphone dengan fitur terkini dan kamera high resolution');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Load saved images on component mount
  React.useEffect(() => {
    const loadSavedImages = async () => {
      try {
        const savedAssets = await AsyncStorage.getItem('@ecom:newProductAssets');
        if (savedAssets) {
          setSelectedImages(JSON.parse(savedAssets));
        }
      } catch (error) {
        console.error('Error loading saved images:', error);
      }
    };

    loadSavedImages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Tambah Produk Baru</Text>
          <Text style={styles.subtitle}>Isi form untuk menambah produk ke katalog</Text>
        </View>

        <View style={styles.form}>
          {/* Image Selection Section */}
          <Text style={styles.label}>Foto Produk (Maksimal 5)</Text>
          
          <TouchableOpacity 
            style={styles.imagePickerButton}
            onPress={handleSelectImages}
            disabled={selectedImages.length >= 5}
          >
            <Icon name="camera-outline" size={24} color="#2196F3" />
            <Text style={styles.imagePickerText}>
              Pilih Foto ({selectedImages.length}/5)
            </Text>
          </TouchableOpacity>

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <View style={styles.imagesContainer}>
              <Text style={styles.selectedImagesLabel}>
                Foto Terpilih:
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesList}>
                  {selectedImages.map((image, index) => (
                    <View key={index} style={styles.imageItem}>
                      <Image source={{ uri: image.uri }} style={styles.previewImage} />
                      <TouchableOpacity 
                        style={styles.removeImageButton}
                        onPress={() => removeImage(index)}
                      >
                        <Icon name="close-circle" size={20} color="#f44336" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

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

          <Text style={styles.selectedCategoryInfo}>
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

          {/* Action Buttons */}
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={handleDemoData}
          >
            <Text style={styles.demoButtonText}>Isi Data Demo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.addButton, 
              (!name || !price || !category || uploading) && styles.disabledButton
            ]}
            onPress={handleAddProduct}
            disabled={!name || !price || !category || uploading}
          >
            {uploading ? (
              <Text style={styles.addButtonText}>⏳ Mengupload...</Text>
            ) : (
              <Text style={styles.addButtonText}>
                📸 Tambah Produk ({selectedImages.length} foto)
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={uploading}
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginTop: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    gap: 10,
  },
  imagePickerText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
  imagesContainer: {
    marginTop: 10,
  },
  selectedImagesLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  imagesList: {
    flexDirection: 'row',
    gap: 10,
  },
  imageItem: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
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
  selectedCategoryInfo: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 8,
    fontStyle: 'italic',
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
    opacity: 0.6,
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