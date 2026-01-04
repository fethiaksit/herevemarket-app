import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles";
import { Product } from "../../types/home";

export default function ProductGrid({
  pageTitle,
  displayProducts,
  renderProductCard,
}: {
  pageTitle: string;
  displayProducts: Product[];
  renderProductCard: (urun: Product) => React.ReactNode;
}) {
  return (
    <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>{pageTitle}</Text>
        {displayProducts.length === 0 ? (<Text style={styles.noProductText}>Bu kategoride henüz ürün bulunmuyor.</Text>) : (<View style={styles.gridContainer}>{displayProducts.map(renderProductCard)}</View>)}
    </View>
  );
}
