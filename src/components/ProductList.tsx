import React, { RefObject } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";

type Props = {
  products: Product[];
  getQuantity: (id: string) => number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onProductPress?: (product: Product) => void;
  listRef?: RefObject<FlatList<Product>>;
  onEndReached?: () => void;
  onScrollBegin?: () => void;
};

export const ProductList: React.FC<Props> = ({
  products,
  getQuantity,
  onAdd,
  onRemove,
  onProductPress,
  listRef,
  onEndReached,
  onScrollBegin,
}) => {
  return (
    <FlatList
      ref={listRef}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onProductPress?.(item)}
          disabled={!onProductPress}
        >
          <ProductCard
            product={item}
            quantity={getQuantity(item.id)}
            onAdd={() => onAdd(item.id)}
            onRemove={() => onRemove(item.id)}
          />
        </TouchableOpacity>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      style={styles.list}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={null}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      onMomentumScrollBegin={onScrollBegin}
      onScrollBeginDrag={onScrollBegin}
      initialNumToRender={6}
      windowSize={8}
      removeClippedSubviews
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  row: {
    gap: 10,
    paddingBottom: 10,
  },
});
