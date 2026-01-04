import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  Linking,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// --- IMPORT ---
import { ProductDetailScreen } from "./ProductDetailScreen"; 

// --- MOCK / CONSTANTS & TYPES ---
import { useCart } from "../hooks/useCart"; 
import { formatPrice } from "../utils/cartPrice"; 
import { getProducts } from "../services/api/products"; 
import { getCategories, CategoryDto } from "../services/api/categories"; 
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../services/api/addresses";
import { submitOrder } from "../services/api/orders";
import { useAuth } from "../context/AuthContext";
import { Address, OrderPayload } from "../types";
import { styles } from "./styles";
import { THEME } from "../constants/theme";
import {
  CAMPAIGN_CATEGORY_ID,
  dailyDeals,
  fallbackCategories,
  fallbackProducts,
  initialAddresses,
  initialPaymentMethods,
  markalar,
  placeholderImage,
  ensureCampaignCategory,
} from "../constants/mockData";
import { LEGAL_URLS } from "../constants/legalUrls";
import { CartLineItem, LegalUrlKey, OrderItemPayload, PaymentMethod, Product, Screen } from "../types/home";
import CartScreen from "./flow/CartScreen";
import AddressScreen from "./flow/AddressScreen";
import GuestAddressScreen from "./flow/GuestAddressScreen";
import PaymentScreen from "./flow/PaymentScreen";
import AddAddressScreen from "./flow/AddAddressScreen";
import AddCardScreen from "./flow/AddCardScreen";
import SummaryScreen from "./flow/SummaryScreen";
import SuccessScreen from "./flow/SuccessScreen";
import HomeHeader from "./home/HomeHeader";
import HomeSlider from "./home/HomeSlider";
import BrandScroller from "./home/BrandScroller";
import ProductGrid from "./home/ProductGrid";

const buildOrderPayload = (
  cartDetails: CartLineItem[],
  totalPrice: number,
  address: Address,
  payment: PaymentMethod
): OrderPayload => {
  const items: OrderItemPayload[] = cartDetails.map(({ product, quantity }) => ({
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
  }));

  return {
    items,
    totalPrice,
    customer: { title: address.title, detail: address.detail, note: address.note },
    paymentMethod: { id: payment.id, label: payment.label },
    createdAt: new Date().toISOString(),
  };
};

// --- MAIN HOMEPAGE COMPONENT ---

export default function HomePage() {
  const navigation = useNavigation<any>();
  const { token, isGuest, logout } = useAuth();
  const { cart, increase, decrease, getQuantity, clearCart } = useCart();
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(CAMPAIGN_CATEGORY_ID);
  
  // Detay sayfası state'leri
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('home'); 

  // Diğer State'ler
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(initialAddresses[0]?.id ?? "");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(initialPaymentMethods[0]?.id ?? "");
  const [orderId, setOrderId] = useState<string>("");
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [guestAddress, setGuestAddress] = useState({ title: "", detail: "", note: "" });
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const sliderRef = useRef<ScrollView | null>(null);
  const categoryListRef = useRef<ScrollView | null>(null);
  const productListRef = useRef<ScrollView | null>(null);
  const productListOffset = useRef(0);
  const { width } = Dimensions.get("window");
  const slideWidth = width - 32;

  // Veri Çekme
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data && data.length ? data : fallbackProducts);
      } catch { setProducts(fallbackProducts); }
      finally { setLoading(false); }
    })();
  }, []);

  const loadAddresses = useCallback(async () => {
    if (!token) {
      setAddresses([]);
      setSelectedAddressId("");
      return;
    }
    setAddressesLoading(true);
    try {
      const data = await getAddresses(token);
      // Ensure data is an array
      const safeData = Array.isArray(data) ? data : [];
      setAddresses(safeData);
      const defaultAddress = safeData.find((address) => address.isDefault) ?? safeData[0];
      setSelectedAddressId(defaultAddress?.id ?? "");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Adresler alınamadı.";
      Alert.alert("Adresler", message);
    } finally {
      setAddressesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && activeScreen === "address") {
      loadAddresses();
    }
  }, [activeScreen, loadAddresses, token]);

  useEffect(() => {
    if (isGuest) {
      setAddresses([]);
      setSelectedAddressId("");
    }
  }, [isGuest]);

  useEffect(() => {
    (async () => {
      try {
        setCategoriesLoading(true);
        const data = await getCategories();
        const active = (data || []).filter(c => c.isActive);
        setCategories(ensureCampaignCategory(active.length ? active : fallbackCategories));
      } catch { setCategories(ensureCampaignCategory(fallbackCategories)); }
      finally { setCategoriesLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId && categories.length) setSelectedCategoryId(CAMPAIGN_CATEGORY_ID);
  }, [categories]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDealIndex((prev) => {
        const next = (prev + 1) % dailyDeals.length;
        sliderRef.current?.scrollTo({ x: next * slideWidth, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [slideWidth]);

  // Filtreleme
  const selectedCategory = useMemo(() => categories.find((c) => c.id === selectedCategoryId), [categories, selectedCategoryId]);
  const campaignProducts = useMemo(() => products.filter((product) => product.isCampaign && product.inStock && product.stock > 0), [products]);
  const selectedCategoryProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    if (selectedCategoryId === CAMPAIGN_CATEGORY_ID) return campaignProducts;
    return products.filter((product) => {
      const productCategoryIds = [...(product.category || []), ...(product.categoryIds || [])].map(String);
      return productCategoryIds.includes(selectedCategoryId) || (selectedCategory && productCategoryIds.includes(selectedCategory.name));
    });
  }, [products, selectedCategoryId, selectedCategory, campaignProducts]);

  const isCategoryScreen = activeScreen === "category";
  
  // Swipe
  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderEnd: (_, gestureState) => {
          const { dx } = gestureState;
          if (Math.abs(dx) > 50) {
            const currentIndex = categories.findIndex((c) => c.id === selectedCategoryId);
            if (currentIndex < 0) return;
            if (dx > 0 && currentIndex > 0) {
              const prevCat = categories[currentIndex - 1];
              setSelectedCategoryId(prevCat.id);
              if (!isCategoryScreen) setActiveScreen("category");
              categoryListRef.current?.scrollTo({ x: (currentIndex - 1) * 100, animated: true });
            } else if (dx < 0 && currentIndex < categories.length - 1) {
              const nextCat = categories[currentIndex + 1];
              setSelectedCategoryId(nextCat.id);
              if (!isCategoryScreen) setActiveScreen("category");
              categoryListRef.current?.scrollTo({ x: (currentIndex + 1) * 100, animated: true });
            }
          }
        },
      }),
    [categories, selectedCategoryId, isCategoryScreen, setActiveScreen, setSelectedCategoryId]
  );

  useEffect(() => {
    if (activeScreen === "home" || activeScreen === "category") {
      requestAnimationFrame(() => {
        productListRef.current?.scrollTo({ y: productListOffset.current, animated: false });
      });
    }
  }, [activeScreen]);

  // Sepet
  const cartDetails = useMemo(() => 
    cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return p ? { product: p, quantity: item.quantity } : null;
    }).filter(Boolean) as CartLineItem[], 
  [cart, products]);
  const cartTotal = useMemo(() => cartDetails.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartDetails]);

  const isOutOfStock = useCallback((product: Product) => !product.inStock || product.stock === 0, []);
  const handleIncrease = useCallback((productId: string) => {
      const product = products.find((item) => item.id === productId);
      if (product && isOutOfStock(product)) { Alert.alert("Bu ürün stokta bulunmuyor"); return; }
      increase(productId);
    }, [increase, isOutOfStock, products]);

  // Ürün Tıklama
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setPreviousScreen(activeScreen);
    setActiveScreen('productDetail');
  };
  const handleCloseDetail = () => { setActiveScreen(previousScreen); setSelectedProduct(null); };

  // Floating Cart
  const pan = useRef(new Animated.ValueXY({ x: 16, y: Dimensions.get("window").height - 120 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5,
      onPanResponderGrant: () => { pan.extractOffset(); },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => { pan.flattenOffset(); },
    })
  ).current;

  const renderProductCard = (urun: Product) => {
    const qty = getQuantity(urun.id);
    const outOfStock = isOutOfStock(urun);
    return (
      <TouchableOpacity 
        key={urun.id} 
        style={[styles.productCard, outOfStock && styles.productCardDisabled]}
        onPress={() => handleProductPress(urun)} 
        activeOpacity={0.9}
      >
        <View style={styles.productImageContainer}>
          <Image source={urun.image ? { uri: urun.image } : placeholderImage} style={styles.productImage} />
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName} numberOfLines={2}>{urun.name}</Text>
          {urun.brand ? <Text style={styles.productBrand}>{urun.brand}</Text> : null}
          {urun.description && urun.description.trim().length > 0 ? (
            <Text style={styles.productDescriptionPreview} numberOfLines={1} ellipsizeMode="tail">
              {urun.description}
            </Text>
          ) : null}
          {outOfStock ? <Text style={styles.outOfStockBadge}>TÜKENDİ</Text> : null}
          <View style={styles.productBottomRow}>
            <Text style={styles.productPrice}>{formatPrice(urun.price)}</Text>
            {qty === 0 ? (
              <TouchableOpacity
                style={[styles.addButton, outOfStock && styles.addButtonDisabled]}
                onPress={() => handleIncrease(urun.id)}
                disabled={outOfStock}
              >
                <Text style={[styles.addButtonText, outOfStock && styles.addButtonTextDisabled]}>
                  {outOfStock ? "YOK" : "EKLE"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => decrease(urun.id)} style={styles.counterBtn}>
                   <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{qty}</Text>
                <TouchableOpacity onPress={() => handleIncrease(urun.id)} style={styles.counterBtn}>
                   <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Navigasyonlar
  const handleCheckout = () => { if (!cartDetails.length) return Alert.alert("Sepet Boş"); setActiveScreen("address"); };
  const handleSaveAddress = async (data: any) => {
    if (!token) return;
    try {
      const created = await createAddress(token, { ...data, isDefault: addresses.length === 0 });
      setAddresses((prev) => [...prev, created]);
      setSelectedAddressId(created.id);
      setActiveScreen("address");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Adres kaydedilemedi.";
      Alert.alert("Adres", message);
    }
  };
  const handleSaveCard = (data: any) => { setPaymentMethods([...paymentMethods, { id: Date.now().toString(), label: data.holder, description: `**** ${data.number.slice(-4)}` }]); setSelectedPaymentId(Date.now().toString()); setActiveScreen("payment"); };
  const handleDeleteAddress = (id: string) => {
    if (!token) return;
    Alert.alert("Adres Sil", "Adresi silmek istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(token, id);
            setAddresses((prev) => prev.filter((address) => address.id !== id));
          } catch (error) {
            const message = error instanceof Error ? error.message : "Adres silinemedi.";
            Alert.alert("Adres", message);
          }
        },
      },
    ]);
  };
  const handleSetDefaultAddress = async (address: Address) => {
    if (!token) return;
    try {
      const currentDefault = addresses.find((item) => item.isDefault);
      if (currentDefault && currentDefault.id !== address.id) {
        await updateAddress(token, currentDefault.id, {
          title: currentDefault.title,
          detail: currentDefault.detail,
          note: currentDefault.note,
          isDefault: false,
        });
      }
      const updated = await updateAddress(token, address.id, {
        title: address.title,
        detail: address.detail,
        note: address.note,
        isDefault: true,
      });
      setAddresses((prev) =>
        prev.map((item) =>
          item.id === updated.id
            ? updated
            : { ...item, isDefault: item.id === currentDefault?.id ? false : item.isDefault }
        )
      );
      setSelectedAddressId(updated.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Varsayılan adres ayarlanamadı.";
      Alert.alert("Adres", message);
    }
  };
  const handleSubmitOrder = async () => {
    if(!cartDetails.length) return Alert.alert("Sepet Boş");
    if (isGuest) {
      if (!guestAddress.title.trim() || !guestAddress.detail.trim()) {
        Alert.alert("Adres Gerekli", "Lütfen teslimat adresini girin.");
        return;
      }
    } else if (!selectedAddressId) {
      Alert.alert("Adres Gerekli", "Lütfen teslimat adresi seçin.");
      return;
    }
    const selectedAddress = isGuest
      ? { id: "guest", ...guestAddress }
      : addresses.find(a=>a.id===selectedAddressId);
    if (!selectedAddress) {
      Alert.alert("Adres Gerekli", "Lütfen teslimat adresi seçin.");
      return;
    }
    const payload = buildOrderPayload(cartDetails, cartTotal, selectedAddress, paymentMethods.find(p=>p.id===selectedPaymentId)!);
    try {
      const response = await submitOrder(payload, token);
      setOrderId(response?.id ?? Math.floor(100000 + Math.random() * 900000).toString());
      clearCart();
      setActiveScreen("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sipariş gönderilemedi.";
      Alert.alert("Sipariş", message);
    }
  };

  const handleAccountPress = () => {
    if (!token) {
      logout();
      return;
    }
    Alert.alert("Hesabım", undefined, [
      { text: "Adreslerim", onPress: () => navigation.navigate("AddressList") },
      { text: "Çıkış Yap", style: "destructive", onPress: () => logout() },
      { text: "Vazgeç", style: "cancel" },
    ]);
  };

  // --- RENDER ---
  if (activeScreen === "productDetail" && selectedProduct) {
    // getQuantity fonksiyonu ile güncel adedi alıyoruz
    const currentQty = getQuantity(selectedProduct.id);
    return (
      <ProductDetailScreen 
        product={selectedProduct} 
        quantity={currentQty} 
        onBack={handleCloseDetail} 
        onIncrease={handleIncrease} 
        onDecrease={decrease} 
        onGoToCart={() => setActiveScreen("cart")}
      />
    );
  }

  if (activeScreen === "cart") return <CartScreen cartDetails={cartDetails} total={cartTotal} onBack={() => setActiveScreen("home")} onCheckout={handleCheckout} onIncrease={handleIncrease} onDecrease={decrease} isOutOfStock={isOutOfStock} />;
  if (activeScreen === "address") {
    if (isGuest) {
      return (
        <GuestAddressScreen
          address={guestAddress}
          onChange={setGuestAddress}
          onBack={() => setActiveScreen("cart")}
          onContinue={() => {
            if (!guestAddress.title.trim() || !guestAddress.detail.trim()) {
              Alert.alert("Adres Gerekli", "Lütfen teslimat adresini girin.");
              return;
            }
            setActiveScreen("payment");
          }}
        />
      );
    }
    return (
      <AddressScreen
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={setSelectedAddressId}
        onBack={() => setActiveScreen("cart")}
        onContinue={() => setActiveScreen("payment")}
        onAddAddress={() => setActiveScreen("addAddress")}
        onDelete={handleDeleteAddress}
        onSetDefault={handleSetDefaultAddress}
        onManageAddresses={() => navigation.navigate("AddressList")}
        showManageButton
        loading={addressesLoading}
      />
    );
  }
  if (activeScreen === "addAddress") return <AddAddressScreen onSave={handleSaveAddress} onCancel={() => setActiveScreen("address")} />;
  if (activeScreen === "payment") return <PaymentScreen methods={paymentMethods} selectedId={selectedPaymentId} onSelect={setSelectedPaymentId} onBack={() => setActiveScreen("address")} onContinue={() => setActiveScreen("summary")} onAddCard={() => setActiveScreen("addCard")} onDelete={(id: string) => setPaymentMethods(paymentMethods.filter(p => p.id !== id))} />;
  if (activeScreen === "addCard") return <AddCardScreen onSave={handleSaveCard} onCancel={() => setActiveScreen("payment")} />;
  if (activeScreen === "summary") {
    const summaryAddress = isGuest
      ? { id: "guest", ...guestAddress }
      : addresses.find(a => a.id === selectedAddressId);
    return (
      <SummaryScreen
        cartDetails={cartDetails}
        total={cartTotal}
        address={summaryAddress}
        payment={paymentMethods.find(p => p.id === selectedPaymentId)}
        onBack={() => setActiveScreen("payment")}
        onSubmit={handleSubmitOrder}
        onPressLegal={(key: LegalUrlKey) => Linking.openURL(LEGAL_URLS[key])}
      />
    );
  }
  if (activeScreen === "success") return <SuccessScreen orderId={orderId} onReturnHome={() => setActiveScreen("home")} />;

  const displayProducts = isCategoryScreen ? selectedCategoryProducts : campaignProducts;
  const pageTitle = isCategoryScreen ? (selectedCategory?.name || "Ürünler") : "Kampanyalı Fırsatlar";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.primary }}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
        <HomeHeader
          isCategoryScreen={isCategoryScreen}
          setActiveScreen={setActiveScreen}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          navigation={navigation}
          isGuest={isGuest}
          token={token}
          handleAccountPress={handleAccountPress}
          categoryListRef={categoryListRef}
        />
        <View style={styles.contentArea} {...swipeResponder.panHandlers}>
            <ScrollView
              ref={productListRef}
              contentContainerStyle={{ paddingBottom: 100 }}
              onScroll={(event) => {
                productListOffset.current = event.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
            >
                {!isCategoryScreen && (
                    <View style={styles.sliderSection}>
                        <HomeSlider
                          dailyDeals={dailyDeals}
                          sliderRef={sliderRef}
                          slideWidth={slideWidth}
                          activeDealIndex={activeDealIndex}
                          setActiveDealIndex={setActiveDealIndex}
                        />
                        <BrandScroller markalar={markalar} />
                    </View>
                )}
                <ProductGrid
                  pageTitle={pageTitle}
                  displayProducts={displayProducts}
                  renderProductCard={renderProductCard}
                />
            </ScrollView>
        </View>
        {cart.length > 0 && (
             <Animated.View style={[styles.floatingCart, { transform: pan.getTranslateTransform() }]} {...panResponder.panHandlers}>
                 <TouchableOpacity onPress={() => setActiveScreen("cart")} style={styles.floatingBtnInner}>
                     <View style={styles.cartIconWrapper}>
                        <Text style={{fontSize: 24}}>🛒</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>{cart.reduce((a,b)=>a+b.quantity,0)}</Text></View>
                     </View>
                     <View style={styles.floatingTotal}><Text style={styles.floatingTotalText}>{formatPrice(cartTotal)}</Text></View>
                 </TouchableOpacity>
             </Animated.View>
        )}
    </SafeAreaView>
  );
}
