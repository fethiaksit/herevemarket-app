import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Category } from "../types";
import { CategoryCard } from "./CategoryCard";

type Props = {
  categories: Category[];
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
  homeOptionLabel?: string;
  homeCategoryId?: string;
};

type CategoryOption = Category & { isHome?: boolean };

export const CategorySelector: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  onSelect,
  homeOptionLabel,
  homeCategoryId = "home",
}) => {
  const data: CategoryOption[] = homeOptionLabel
    ? ([{ id: homeCategoryId, name: homeOptionLabel, isHome: true }, ...categories] as CategoryOption[])
    : categories;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={() => onSelect(item.id)}
            isSelected={selectedCategoryId === item.id}
          />
        )}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
