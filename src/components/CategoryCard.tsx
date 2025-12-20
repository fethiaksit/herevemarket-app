import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Category } from "../types";

type Props = {
  category: Category;
  onPress: () => void;
  isSelected?: boolean;
};

export const CategoryCard: React.FC<Props> = ({ category, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isSelected ? styles.selected : null]}
    >
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>{category.name.charAt(0)}</Text>
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 110,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    elevation: 2,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#082A5F",
  },
  iconPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF4CC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconText: { fontSize: 20, fontWeight: "800", color: "#082A5F" },
  name: { fontSize: 13, fontWeight: "600", color: "#082A5F", textAlign: "center" },
});
