import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { Header } from "./components/Header";
import { Cart } from "./components/Cart";
import { LoginModal } from "./components/LoginModal";
import { AddressModal } from "./components/AddressModal";
import { CategorySelector } from "./components/CategorySelector";
import { ProductList } from "./components/ProductList";
import { PromoSlider } from "./components/PromoSlider";
import { categories, products } from "./data";
import { ProductDetailScreen } from "./screens/ProductDetailScreen";
import { CartItem, Product } from "./types";

const PROMO_CATEGORY_ID = "promo";
const HOME_CATEGORY_ID = "home";
const DETAIL_SCREEN = "productDetail";
const HOME_SCREEN = "home";

type ScreenKey = typeof DETAIL_SCREEN | typeof HOME_SCREEN;

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(HOME_CATEGORY_ID);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [activeScreen, setActiveScreen] = useState<ScreenKey>(HOME_SCREEN);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const listRef = useRef<FlatList<Product>>(null);
  const hasUserScrolledRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (!product.inStock || product.stock === 0) {
      Alert.alert("Bu ürün stokta bulunmuyor");
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      if (existing) return prev.map((i) => (i.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    const product = products.find((p) => p.id === id);
    if (product && (!product.inStock || product.stock === 0)) {
      Alert.alert("Bu ürün stokta bulunmuyor");
      return;
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const handleRemove = (id: string) => setCartItems((prev) => prev.filter((i) => i.id !== id));

  const getQty = (id: string) => cartItems.find((i) => i.id === id)?.quantity || 0;

  const selectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleProductPress = useCallback((product: Product) => {
    setSelectedProduct(product);
    setActiveScreen(DETAIL_SCREEN);
  }, []);

  const handleBackToList = useCallback(() => {
    setActiveScreen(HOME_SCREEN);
  }, []);

  const categoryRotation = useMemo(() => categories.map((c) => c.id), []);

  const productsByCategory = useMemo(() => {
    return products.reduce<Record<string, Product[]>>((acc, product) => {
      if (!acc[product.categoryId]) acc[product.categoryId] = [];
      acc[product.categoryId].push(product);
      return acc;
    }, {});
  }, []);

  const getNextCategoryId = useCallback(() => {
    if (selectedCategoryId === HOME_CATEGORY_ID) {
      return categoryRotation[0] || HOME_CATEGORY_ID;
    }

    if (!categoryRotation.length) return HOME_CATEGORY_ID;

    const currentIndex = categoryRotation.indexOf(selectedCategoryId);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + 1) % categoryRotation.length;
    return categoryRotation[nextIndex];
  }, [categoryRotation, selectedCategoryId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: false });
    }
    hasUserScrolledRef.current = false;
    isTransitioningRef.current = false;
  }, [selectedCategoryId]);

  const isHome = selectedCategoryId === HOME_CATEGORY_ID;

  const displayedProducts: Product[] = useMemo(() => {
    if (isHome) return productsByCategory[PROMO_CATEGORY_ID] || [];
    return productsByCategory[selectedCategoryId] || [];
  }, [isHome, productsByCategory, selectedCategoryId]);

  const handleEndReached = useCallback(() => {
    if (!hasUserScrolledRef.current || isTransitioningRef.current) return;

    const nextCategory = getNextCategoryId();
    if (nextCategory !== selectedCategoryId) {
      isTransitioningRef.current = true;
      setSelectedCategoryId(nextCategory);
    }
    hasUserScrolledRef.current = false;
  }, [getNextCategoryId, selectedCategoryId]);

  const handleScrollBegin = useCallback(() => {
    hasUserScrolledRef.current = true;
  }, []);

  const isDetailScreen = activeScreen === DETAIL_SCREEN && selectedProduct !== null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        cartCount={cartItems.length}
        onCartPress={() => setIsCartOpen(true)}
        onAddressPress={() => setIsAddressOpen(true)}
        onHomePress={() => {
          setSelectedCategoryId(HOME_CATEGORY_ID);
          setActiveScreen(HOME_SCREEN);
        }}
      />

      <View style={styles.container}>
        {isDetailScreen && selectedProduct ? (
          <ProductDetailScreen
            product={selectedProduct}
            onBack={handleBackToList}
          />
        ) : (
          <>
            <CategorySelector
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={selectCategory}
              homeOptionLabel="Anasayfa"
              homeCategoryId={HOME_CATEGORY_ID}
            />

            {isHome ? <PromoSlider /> : null}

            <View style={styles.listWrapper}>
              <ProductList
                products={displayedProducts}
                getQuantity={getQty}
                onAdd={handleAddToCart}
                onRemove={(id) => handleUpdateQuantity(id, Math.max(0, getQty(id) - 1))}
                onProductPress={handleProductPress}
                listRef={listRef}
                onEndReached={handleEndReached}
                onScrollBegin={handleScrollBegin}
              />
            </View>
          </>
        )}
      </View>

      <Cart
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
      <LoginModal visible={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AddressModal visible={isAddressOpen} onClose={() => setIsAddressOpen(false)} onSelect={(a) => setSelectedAddress(a)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  listWrapper: {
    flex: 1,
    paddingTop: 4,
  },
});
