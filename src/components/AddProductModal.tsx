import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Product } from '../types';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  visible,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    // Validasi
    if (!name.trim()) {
      Alert.alert('Error', 'Nama produk wajib diisi.');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Harga wajib diisi dengan angka yang valid.');
      return;
    }
    try {
      new URL(imageUrl); // Validasi URL
    } catch (_) {
      Alert.alert('Error', 'URL Gambar tidak valid.');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(), // ID unik sederhana
      name: name.trim(),
      price: Number(price),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
    };

    onAddProduct(newProduct);
    // Reset form
    setName('');
    setPrice('');
    setImageUrl('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Tambah Produk Baru</Text>
        <ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Nama Produk"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Harga"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="URL Gambar"
            value={imageUrl}
            onChangeText={setImageUrl}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Deskripsi (opsional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button title="Batal" onPress={onClose} color="#95a5a6" />
          <View style={{ width: 10 }} />
          <Button title="Simpan" onPress={handleSubmit} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // Android
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default AddProductModal;