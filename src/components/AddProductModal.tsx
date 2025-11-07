import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Product } from "../types/product";

// Fungsi untuk validasi URL
function isValidUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AddProductModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (p: Omit<Product, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reset = () => {
    setName("");
    setPrice("");
    setImageUrl("");
    setDescription("");
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nama produk wajib diisi.";
    if (!price.trim()) e.price = "Harga wajib diisi.";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(price.trim()))
      e.price = "Masukkan angka yang valid (contoh: 49.99).";
    if (!imageUrl.trim()) e.imageUrl = "URL gambar wajib diisi.";
    else if (!isValidUrl(imageUrl.trim()))
      e.imageUrl = "URL tidak valid (harus diawali http/https).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const p: Omit<Product, "id"> = {
      name: name.trim(),
      price: Number(price),
      imageUrl: imageUrl.trim(),
      description: description.trim() || undefined,
    };

    try {
      onAdd(p);
      reset();
    } catch {
      Alert.alert("Kesalahan", "Gagal menambahkan produk. Silakan coba lagi.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.wrapper}
      >
        <View style={styles.backdrop} />
        <View style={styles.modal}>
          <Text style={styles.heading}>Tambah Produk Baru</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Nama Produk */}
            <View style={styles.field}>
              <Text style={styles.label}>Nama Produk *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Contoh: Kaos Polos"
                style={[styles.input, errors.name && styles.inputError]}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            {/* Harga Produk */}
            <View style={styles.field}>
              <Text style={styles.label}>Harga (angka) *</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="Contoh: 49.99"
                keyboardType="decimal-pad"
                style={[styles.input, errors.price && styles.inputError]}
              />
              {errors.price && <Text style={styles.error}>{errors.price}</Text>}
            </View>

            {/* URL Gambar */}
            <View style={styles.field}>
              <Text style={styles.label}>URL Gambar *</Text>
              <TextInput
                value={imageUrl}
                onChangeText={setImageUrl}
                placeholder="https://..."
                autoCapitalize="none"
                style={[styles.input, errors.imageUrl && styles.inputError]}
              />
              {errors.imageUrl && <Text style={styles.error}>{errors.imageUrl}</Text>}
            </View>

            {/* Deskripsi */}
            <View style={styles.field}>
              <Text style={styles.label}>Deskripsi (opsional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Tulis deskripsi singkat produk"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </View>

            {/* Tombol Aksi */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  reset();
                  onClose();
                }}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "85%",
  },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#f44336" },
  error: { color: "#f44336", marginTop: 6, fontSize: 12 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#eee",
    marginRight: 8,
  },
  cancelText: { fontWeight: "600" },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#1f6feb",
  },
  submitText: { color: "white", fontWeight: "700" },
});
