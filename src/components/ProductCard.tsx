import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Product } from "../types";

type Props = {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
};

export const ProductCard: React.FC<Props> = ({ product, quantity, onAdd, onRemove }) => {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.title}>{product.name}</Text>
      </View>
      <Text style={styles.price}>{product.price.toFixed(2)} ₺</Text>

      <View style={styles.row}>
        <TouchableOpacity onPress={onRemove} style={styles.qtyBtn}>
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qty}>{quantity}</Text>

        <TouchableOpacity onPress={onAdd} style={[styles.qtyBtn, styles.add]}>
          <Text style={[styles.qtyText, { color: "#fff" }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    flex: 1,
    minWidth: 150,
    marginBottom: 10,
  },
  top: { minHeight: 36, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#082A5F" },
  price: { fontSize: 14, color: "#333", marginVertical: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  add: { backgroundColor: "#082A5F", borderColor: "#082A5F" },
  qtyText: { fontSize: 18, fontWeight: "700" },
  qty: { fontSize: 16, minWidth: 20, textAlign: "center" },
});
