import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const SLIDES = [
  {
    id: "fast-delivery",
    title: "Dakikalar içinde kapında",
    subtitle: "Evine en yakın marketten sipariş ver",
  },
  {
    id: "campaigns",
    title: "Kampanyaları Yakala",
    subtitle: "Sana özel indirimlerle sepetini doldur",
  },
  {
    id: "fresh",
    title: "Tazelik Garantisi",
    subtitle: "Her kategoride taze ürünler",
  },
];

export const PromoSlider: React.FC = () => {
  return (
    <FlatList
      data={SLIDES}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  slide: {
    width: 320,
    padding: 16,
    backgroundColor: "#082A5F",
    borderRadius: 14,
    marginRight: 12,
  },
  title: {
    color: "#FFD300",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: "#E4E7EC",
    fontSize: 14,
  },
});
