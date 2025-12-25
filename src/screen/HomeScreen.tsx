import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { Category, Product } from "../types";
import { CategorySelector } from "../components/CategorySelector";
import { ProductList } from "../components/ProductList";

type Props = {
  categories: Category[];
  promoCategoryId: string;
  products: Product[];
  onCategoryPress: (categoryId: string) => void;
  getQuantity: (id: string) => number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
};

export const HomeScreen: React.FC<Props> = ({
  categories,
  promoCategoryId,
  products,
  onCategoryPress,
  getQuantity,
  onAdd,
  onRemove,
}) => {
  const promotionalProducts = products.filter(
    (product) => product.isCampaign && product.inStock && product.stock > 0
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Dakikalar içinde kapında!</Text>
        <Text style={styles.heroSub}>Kampanyalı ürünleri yakala ve sepete ekle</Text>
      </View>

      <Text style={styles.sectionTitle}>Kategoriler</Text>
      <CategorySelector
        categories={categories}
        onSelect={onCategoryPress}
        selectedCategoryId={promoCategoryId}
      />

      <Text style={styles.sectionTitle}>Kampanyalı Ürünler</Text>
      <ProductList products={promotionalProducts} getQuantity={getQuantity} onAdd={onAdd} onRemove={onRemove} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: { backgroundColor: "#082A5F", padding: 16, borderRadius: 12, marginBottom: 16 },
  heroTitle: { color: "#FFD300", fontSize: 20, fontWeight: "800" },
  heroSub: { color: "rgba(255,255,255,0.9)", marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#082A5F", marginBottom: 8 },
});
