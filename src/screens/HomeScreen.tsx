import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddProductModal from "../components/AddProductModal";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/product";
import { INITIAL_PRODUCTS } from "../data/products";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const numColumns = useMemo(() => (width > 700 ? 2 : 1), [width]);

  const handleAddProduct = (p: Omit<Product, "id">) => {
    const newProduct: Product = { ...p, id: String(Date.now()) };
    setProducts((prev) => [newProduct, ...prev]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0 },
      ]}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mini E-Commerce</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>+ Tambah Produk</Text>
          </TouchableOpacity>
        </View>

        {/* Daftar Produk */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        />

        {/* Modal Tambah Produk */}
        <AddProductModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={(product) => {
            handleAddProduct(product);
            setModalVisible(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { flex: 1, paddingHorizontal: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  title: { fontSize: 22, fontWeight: "700" },
  addBtn: {
    backgroundColor: "#1f6feb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: { color: "white", fontWeight: "600" },
  listContainer: { paddingBottom: 24 },
  columnWrapper: { justifyContent: "space-between" },
});
