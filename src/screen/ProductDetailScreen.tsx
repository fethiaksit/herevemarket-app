import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";

type Props = {
  product: Product;
  products: Product[];
  onBack: () => void;
  onAddToCart: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
};

const getAlternativeProducts = (products: Product[], product: Product, limit = 6) => {
  const primaryMatches = products.filter((item) => {
    if (item.id === product.id) return false;
    if (product.categoryId && item.categoryId === product.categoryId) return true;
    if (product.brand && item.brand === product.brand) return true;
    return false;
  });

  const fallbackMatches = products.filter(
    (item) => item.id !== product.id && !primaryMatches.some((match) => match.id === item.id),
  );

  return [...primaryMatches, ...fallbackMatches].slice(0, limit);
};

export const ProductDetailScreen: React.FC<Props> = ({
  product,
  products,
  onBack,
  onAddToCart,
  onSelectProduct,
}) => {
  const isOutOfStock = product.stock === 0;
  const alternatives = useMemo(() => getAlternativeProducts(products, product), [products, product]);
  const handleAddToCart = useCallback((productId: string) => onAddToCart(productId), [onAddToCart]);
  const handleBackPress = useCallback(() => onBack(), [onBack]);
  const handleNoop = useCallback(() => undefined, []);
  const renderAlternativeItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        quantity={0}
        onAdd={handleNoop}
        onRemove={handleNoop}
        onPress={() => onSelectProduct(item)}
        showActions={false}
        showImage
        containerStyle={styles.altCard}
      />
    ),
    [handleNoop, onSelectProduct],
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backText}>Geri</Text>
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
        {product.description ? <Text style={styles.description}>{product.description}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.addButton, isOutOfStock && styles.addButtonDisabled]}
        onPress={() => handleAddToCart(product.id)}
        disabled={isOutOfStock}
      >
        <Text style={[styles.addButtonText, isOutOfStock && styles.addButtonTextDisabled]}>Sepete Ekle</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Benzer Ürünler</Text>
      <FlatList
        data={alternatives}
        keyExtractor={(item) => item.id}
        renderItem={renderAlternativeItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.altList}
      />
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
  description: {
    marginTop: 12,
    color: "#374151",
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: "#082A5F",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonDisabled: {
    backgroundColor: "#e5e7eb",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  addButtonTextDisabled: {
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  altList: {
    paddingBottom: 12,
  },
  altCard: {
    width: 170,
    marginRight: 12,
    flex: 0,
  },
});
