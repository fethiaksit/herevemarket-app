import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../types";

type Props = {
  product: Product;
  onBack: () => void;
};

export const ProductDetailScreen: React.FC<Props> = ({ product, onBack }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      </View>

      {product.image ? <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" /> : null}

      <View style={styles.infoCard}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{product.price.toFixed(2)} ₺</Text>
        {product.brand ? <Text style={styles.meta}>Marka: {product.brand}</Text> : null}
        {product.barcode ? <Text style={styles.meta}>Barkod: {product.barcode}</Text> : null}
        <Text style={[styles.stock, isOutOfStock ? styles.stockOut : styles.stockIn]}>
          {isOutOfStock ? "Tükendi" : "Stokta"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  backText: {
    color: "#082A5F",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#082A5F",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginTop: 8,
  },
  meta: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
  },
  stock: {
    marginTop: 10,
    fontWeight: "700",
  },
  stockIn: {
    color: "#16a34a",
  },
  stockOut: {
    color: "#dc2626",
  },
});
