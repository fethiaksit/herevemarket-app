import React from "react";
import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Product } from "../types";

type Props = {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onPress?: () => void;
  showActions?: boolean;
  showImage?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export const ProductCard: React.FC<Props> = ({
  product,
  quantity,
  onAdd,
  onRemove,
  onPress,
  showActions = true,
  showImage = false,
  containerStyle,
}) => {
  const isOutOfStock = !product.inStock || product.stock === 0;
  const cardStyles = [styles.card, isOutOfStock && styles.cardDisabled, containerStyle];

  const content = (
    <>
      {showImage && product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.top}>
        <Text style={styles.title}>{product.name}</Text>
        {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
        {product.description && product.description.trim().length > 0 ? (
          <Text style={styles.descriptionPreview} numberOfLines={1} ellipsizeMode="tail">
            {product.description}
          </Text>
        ) : null}
        {isOutOfStock ? <Text style={styles.stockBadge}>TÜKENDİ</Text> : null}
      </View>
      <Text style={styles.price}>{product.price.toFixed(2)} ₺</Text>

      {showActions ? (
        <View style={styles.row}>
          <TouchableOpacity onPress={onRemove} style={styles.qtyBtn}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{quantity}</Text>

          <TouchableOpacity
            onPress={onAdd}
            style={[styles.qtyBtn, styles.add, isOutOfStock && styles.addDisabled]}
            disabled={isOutOfStock}
          >
            <Text style={[styles.qtyText, isOutOfStock ? styles.addDisabledText : { color: "#fff" }]}>
              {isOutOfStock ? "Stokta Yok" : "+"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyles} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{content}</View>;
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
  image: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#e5e7eb",
  },
  top: { minHeight: 36, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#082A5F" },
  brand: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  descriptionPreview: { fontSize: 12, color: "#6b7280", marginTop: 4 },
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
  addDisabled: {
    backgroundColor: "#e5e7eb",
    borderColor: "#e5e7eb",
    width: 90,
  },
  addDisabledText: {
    color: "#6b7280",
    fontSize: 12,
  },
  qtyText: { fontSize: 18, fontWeight: "700" },
  qty: { fontSize: 16, minWidth: 20, textAlign: "center" },
  cardDisabled: { opacity: 0.5 },
  stockBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    backgroundColor: "#ef4444",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: "700",
    overflow: "hidden",
  },
});
