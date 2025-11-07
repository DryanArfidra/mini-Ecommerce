import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Product } from "../types/product";

const screenWidth = Dimensions.get("window").width;

export default function ProductCard({ product }: { product: Product }) {
  const isWide = screenWidth > 700;
  const cardWidth = isWide ? (screenWidth - 48) / 2 : screenWidth - 24;

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.price}>Rp {product.price.toFixed(2)}</Text>
        {product.description && <Text style={styles.desc} numberOfLines={2}>{product.description}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: "100%", height: 160 },
  content: { padding: 10 },
  name: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "600", color: "#1f6feb", marginBottom: 6 },
  desc: { fontSize: 13, color: "#333" },
});
