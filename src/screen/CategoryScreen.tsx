import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Category, Product } from "../types";
import { CategorySelector } from "../components/CategorySelector";
import { ProductList } from "../components/ProductList";

type Props = {
  categories: Category[];
  selectedCategoryId: string;
  products: Product[];
  onSelectCategory: (categoryId: string) => void;
  getQuantity: (id: string) => number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export const CategoryScreen: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  products,
  onSelectCategory,
  getQuantity,
  onAdd,
  onRemove,
}) => {
  const categoryName = categories.find((c) => c.id === selectedCategoryId)?.name ?? "Kategori";
  const filtered = products.filter((product) => product.categoryId === selectedCategoryId);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Kategoriler</Text>
      <CategorySelector
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onSelectCategory}
      />

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{categoryName}</Text>
        <Text style={styles.subtitle}>Kategori sayfası içinde geçiş yapabilirsin</Text>
      </View>

      <ProductList products={filtered} getQuantity={getQuantity} onAdd={onAdd} onRemove={onRemove} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#082A5F", marginBottom: 8 },
  headerRow: { marginBottom: 4 },
  subtitle: { color: "#475467", fontSize: 13 },
});
