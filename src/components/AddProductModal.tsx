import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProduct: (product: any) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

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
      image: image || 'https://via.placeholder.com/150',
      isNew: true,
    };

    onAddProduct(newProduct);
    resetForm();
    onClose();
    Alert.alert('Success', 'Produk berhasil ditambahkan!');
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory('');
    setDescription('');
    setImage('');
  };

  const categories = [
    'Elektronik',
    'Fashion',
    'Food',
    'Automotive',
    'Baby Gear',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Tambah Produk Baru</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Tutup</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={styles.label}>Nama Produk *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Masukkan nama produk"
            />

            <Text style={styles.label}>Harga *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Masukkan harga"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Kategori *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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

            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Masukkan deskripsi produk"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>URL Gambar</Text>
            <TextInput
              style={styles.input}
              value={image}
              onChangeText={setImage}
              placeholder="Masukkan URL gambar (opsional)"
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
              <Text style={styles.addButtonText}>Tambah Produk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 16,
    color: '#2196F3',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginVertical: 8,
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
  },
  selectedCategoryText: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  addButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default AddProductModal;