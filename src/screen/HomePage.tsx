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
  ImageSourcePropType,
  TextInput,
  Alert,
  Linking,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";

// --- MOCK / CONSTANTS & TYPES ---
import { useCart } from "../hooks/useCart"; 
import { formatPrice } from "../utils/cartPrice"; 
import { getProducts, ProductDto } from "../services/api/products"; 
import { getCategories, CategoryDto } from "../services/api/categories"; 

// Renk Paleti
const THEME = {
  primary: "#004AAD",    
  primaryLight: "#E6F0FA",
  secondary: "#FFD700",  
  secondaryDark: "#FDB913",
  background: "#F8F9FA",
  white: "#FFFFFF",
  textDark: "#1F2937",
  textGray: "#6B7280",
  textLight: "#9CA3AF",
  danger: "#EF4444",
  success: "#10B981",
  borderColor: "#E5E7EB",
};

type Brand = { name: string; image: ImageSourcePropType };
type Product = ProductDto & { categoryIds?: string[] };
type Address = { id: string; title: string; detail: string; note?: string };
type PaymentMethod = { id: string; label: string; description: string };
type OrderItemPayload = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderPayload = {
  items: OrderItemPayload[];
  totalPrice: number;
  customer: { title: string; detail: string; note?: string };
  paymentMethod: { id: string; label?: string };
  createdAt: string;
};
type Screen =
  | "home"
  | "category"
  | "cart"
  | "address"
  | "addAddress"
  | "payment"
  | "addCard"
  | "summary"
  | "success";

type CartLineItem = { product: Product; quantity: number };

const CART_FOOTER_HEIGHT = 180;
const CAMPAIGN_CATEGORY_ID = "campaign";
const CAMPAIGN_CATEGORY_NAME = "Fırsatlar"; 
const LEGAL_URLS = {
  about: "https://herevemarket.com/hakkimizrda",
  ssl: "https://herevemarket.com/ssl-sertifikasi",
  returns: "https://herevemarket.com/teslimat-iade",
  privacy: "https://herevemarket.com/gizlilik",
  distance: "https://herevemarket.com/mesafeli-satis",
} as const;

const markalar: Brand[] = [
  { name: "Eti", image: require("../../assets/eti.png") },
  { name: "Ülker", image: require("../../assets/ulker.png") },
  { name: "Torku", image: require("../../assets/torku.png") },
  { name: "Axe", image: require("../../assets/cola.png") },
  { name: "Clear", image: require("../../assets/axe.png") },
  { name: "Domestos", image: require("../../assets/Domestos.png") },
  { name: "Dove", image: require("../../assets/Dove.png") },
  { name: "OMO", image: require("../../assets/OMO.png") },
  { name: "Signal", image: require("../../assets/signal.png") },
  { name: "Knorr", image: require("../../assets/knoor.png") },
];

const placeholderImage = require("../../assets/logo.png");
const dailyDeals = [
  require("../../assets/banner1.png"),
  require("../../assets/banner2.png"),
  require("../../assets/banner3.png"),
];

const fallbackProducts: Product[] = [
  {
    id: "sample-su",
    name: "Doğal Kaynak Suyu 5L",
    price: 45.90,
    image: "https://cdn.example.com/ayran.png",
    imageUrl: "https://cdn.example.com/ayran.png",
    category: ["İçecek", "Temel Gıda"],
    isCampaign: true,
  },
];

const fallbackCategories: CategoryDto[] = [
  { id: "İçecek", name: "İçecek", isActive: true, createdAt: "" },
  { id: "Temel Gıda", name: "Temel Gıda", isActive: true, createdAt: "" },
];

const ensureCampaignCategory = (list: CategoryDto[]): CategoryDto[] => {
  const filtered = list.filter(
    (category) =>
      category.id !== CAMPAIGN_CATEGORY_ID &&
      category.name !== CAMPAIGN_CATEGORY_NAME
  );
  return [
    {
      id: CAMPAIGN_CATEGORY_ID,
      name: CAMPAIGN_CATEGORY_NAME,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    ...filtered,
  ];
};

const initialAddresses: Address[] = [];
const initialPaymentMethods: PaymentMethod[] = [
  { id: "card", label: "Kredi Kartı", description: "Visa - **** 4242" },
];

// --- HELPER FUNCTIONS ---

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
    customer: {
      title: address.title,
      detail: address.detail,
      note: address.note,
    },
    paymentMethod: {
      id: payment.id,
      label: payment.label,
    },
    createdAt: new Date().toISOString(),
  };
};

// --- COMPONENTS ---

function CartScreen({
  cartDetails,
  total,
  onBack,
  onCheckout,
  onIncrease,
  onDecrease,
}: {
  cartDetails: CartLineItem[];
  total: number;
  onBack: () => void;
  onCheckout: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}) {
  const isCheckoutDisabled = cartDetails.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Sepetim</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: CART_FOOTER_HEIGHT + 20 }}>
        {cartDetails.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateIcon}>🛒</Text>
            <Text style={styles.emptyStateTitle}>Sepetiniz Henüz Boş</Text>
            <Text style={styles.emptyStateText}>
              İhtiyaçlarını hemen eklemeye başla, kapına gelsin.
            </Text>
            <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
              <Text style={styles.secondaryButtonText}>Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartListContainer}>
            {cartDetails.map((item) => (
              <View key={item.product.id} style={styles.cartItemCard}>
                <Image
                  source={item.product.image ? { uri: item.product.image } : placeholderImage}
                  style={styles.cartItemImage}
                />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>
                  <Text style={styles.cartItemSinglePrice}>
                    {formatPrice(item.product.price)}
                  </Text>
                </View>
                
                <View style={styles.cartItemActions}>
                  <View style={styles.quantityControlSmall}>
                    <TouchableOpacity
                      style={styles.qtyBtnSmall}
                      onPress={() => onDecrease(item.product.id)}
                    >
                      <Text style={styles.qtyBtnTextSmall}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyTextSmall}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtnSmall}
                      onPress={() => onIncrease(item.product.id)}
                    >
                      <Text style={styles.qtyBtnTextSmall}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cartItemTotalPrice}>
                    {formatPrice(item.product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Ara Toplam</Text>
          <Text style={styles.footerValue}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerLabel}>Teslimat</Text>
          <Text style={[styles.footerValue, { color: THEME.success }]}>Ücretsiz</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.footerTotalRow}>
          <Text style={styles.footerTotalLabel}>Toplam Tutar</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, isCheckoutDisabled && styles.disabledButton]}
          onPress={onCheckout}
          disabled={isCheckoutDisabled}
        >
          <Text style={styles.primaryButtonText}>Siparişi Tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddressScreen({
  addresses,
  selectedId,
  onSelect,
  onBack,
  onContinue,
  onAddAddress,
  onDelete,
}: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Teslimat Adresi</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Kayıtlı Adreslerim</Text>
        {addresses.map((address: Address) => {
          const isSelected = selectedId === address.id;
          return (
            <TouchableOpacity
              key={address.id}
              style={[styles.selectionCard, isSelected && styles.selectionCardActive]}
              onPress={() => onSelect(address.id)}
            >
              <View style={styles.selectionHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.radioIcon}>{isSelected ? "◉" : "○"}</Text>
                  <Text style={styles.selectionTitle}>{address.title}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(address.id)}>
                   <Text style={styles.deleteText}>Sil</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.selectionDetail}>{address.detail}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.dashedButton} onPress={onAddAddress}>
          <Text style={styles.dashedButtonText}>+ Yeni Adres Ekle</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PaymentScreen({
  methods,
  selectedId,
  onSelect,
  onBack,
  onContinue,
  onAddCard,
  onDelete,
}: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Ödeme Yöntemi</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>Kayıtlı Kartlarım</Text>
        {methods.map((method: PaymentMethod) => {
          const isSelected = selectedId === method.id;
          return (
            <TouchableOpacity
              key={method.id}
              style={[styles.selectionCard, isSelected && styles.selectionCardActive]}
              onPress={() => onSelect(method.id)}
            >
               <View style={styles.selectionHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.radioIcon}>{isSelected ? "◉" : "○"}</Text>
                  <Text style={styles.selectionTitle}>{method.label}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(method.id)}>
                   <Text style={styles.deleteText}>Sil</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.selectionDetail}>{method.description}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.dashedButton} onPress={onAddCard}>
          <Text style={styles.dashedButtonText}>+ Yeni Kart Ekle</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Onayla ve İlerle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddAddressScreen({ onSave, onCancel }: any) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [note, setNote] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onCancel}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Adres Ekle</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.inputLabel}>Adres Başlığı</Text>
        <TextInput style={styles.input} placeholder="Örn: Evim" value={title} onChangeText={setTitle} />
        
        <Text style={styles.inputLabel}>Adres Detayı</Text>
        <TextInput style={[styles.input, { height: 80 }]} multiline placeholder="Mahalle, Cadde, Sokak..." value={detail} onChangeText={setDetail} />

        <Text style={styles.inputLabel}>Not (Opsiyonel)</Text>
        <TextInput style={styles.input} placeholder="Zile basmayınız vb." value={note} onChangeText={setNote} />
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSave({ title, detail, note })}>
          <Text style={styles.primaryButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function AddCardScreen({ onSave, onCancel }: any) {
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onCancel}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Kart Ekle</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.inputLabel}>Kart Üzerindeki İsim</Text>
        <TextInput style={styles.input} placeholder="Ad Soyad" value={holder} onChangeText={setHolder} />
        
        <Text style={styles.inputLabel}>Kart Numarası</Text>
        <TextInput style={styles.input} placeholder="0000 0000 0000 0000" maxLength={16} keyboardType="numeric" value={number} onChangeText={setNumber} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
             <Text style={styles.inputLabel}>SKT (AA/YY)</Text>
             <TextInput style={styles.input} placeholder="MM/YY" maxLength={5} value={expiry} onChangeText={setExpiry} />
          </View>
          <View style={{ width: "48%" }}>
             <Text style={styles.inputLabel}>CVV</Text>
             <TextInput style={styles.input} placeholder="123" maxLength={3} keyboardType="numeric" value={cvv} onChangeText={setCvv} />
          </View>
        </View>
        
        <View style={styles.legalLogosRow}>
            <Image source={require("../../assets/visa.png")} style={styles.paymentLogo} resizeMode="contain" />
            <Image source={require("../../assets/mastercard.png")} style={styles.paymentLogo} resizeMode="contain" />
        </View>
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSave({ holder, number, expiry, cvv })}>
          <Text style={styles.primaryButtonText}>Kartı Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryScreen({
  cartDetails,
  total,
  address,
  payment,
  onBack,
  onSubmit,
  onPressLegal,
}: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}>
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenterAbsolute}>
           <Text style={styles.headerTitle}>Sipariş Özeti</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
            <Text style={styles.summarySectionTitle}>Teslimat Bilgileri</Text>
            <Text style={styles.summaryTextBold}>{address?.title}</Text>
            <Text style={styles.summaryText}>{address?.detail}</Text>
        </View>

        <View style={styles.summaryCard}>
            <Text style={styles.summarySectionTitle}>Ödeme Bilgileri</Text>
            <Text style={styles.summaryTextBold}>{payment?.label}</Text>
            <Text style={styles.summaryText}>{payment?.description}</Text>
        </View>

        <View style={styles.summaryCard}>
            <Text style={styles.summarySectionTitle}>Ürünler</Text>
            {cartDetails.map((item: CartLineItem) => (
                <View key={item.product.id} style={styles.summaryItemRow}>
                    <Text style={styles.summaryItemName}>{item.quantity}x {item.product.name}</Text>
                    <Text style={styles.summaryItemPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
                </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryTotalRow}>
                <Text style={styles.footerTotalLabel}>Toplam Ödenecek</Text>
                <Text style={styles.footerTotalValue}>{formatPrice(total)}</Text>
            </View>
        </View>
        
        <View style={styles.legalContainer}>
            <TouchableOpacity onPress={() => onPressLegal('distance')}><Text style={styles.legalLink}>Mesafeli Satış Sözleşmesi</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => onPressLegal('privacy')}><Text style={styles.legalLink}>Gizlilik Politikası</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
          <Text style={styles.primaryButtonText}>Siparişi Onayla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SuccessScreen({ orderId, onReturnHome }: { orderId: string; onReturnHome: () => void }) {
  return (
    <View style={styles.successContainer}>
      <View style={styles.successCircle}>
        <Text style={{ fontSize: 40 }}>🎉</Text>
      </View>
      <Text style={styles.successTitle}>Siparişin Alındı!</Text>
      <Text style={styles.successText}>
        Sipariş Numaran: <Text style={{fontWeight: 'bold'}}>#{orderId}</Text>
      </Text>
      <Text style={styles.successSubText}>
        Hazırlanmaya başladığında sana bildirim göndereceğiz. Afiyet olsun!
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onReturnHome}>
        <Text style={styles.primaryButtonText}>Anasayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- MAIN HOMEPAGE COMPONENT ---

export default function HomePage() {
  const { cart, increase, decrease, getQuantity, clearCart } = useCart();
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(CAMPAIGN_CATEGORY_ID);
  
  // States
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(initialAddresses[0]?.id ?? "");
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(initialPaymentMethods[0]?.id ?? "");
  const [orderId, setOrderId] = useState<string>("");

  // Loading/Error states
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Slider Logic
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const sliderRef = useRef<ScrollView | null>(null);
  const categoryListRef = useRef<ScrollView | null>(null);
  const { width } = Dimensions.get("window");
  
  // Slide Width Düzenlemesi: Kenar boşlukları hesaba katılmalı
  const slideWidth = width - 32;

  // Veri Çekme Efektleri
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

  // Slider Otomatik Geçiş
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

  // Filtreleme Mantığı
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );

  const campaignProducts = useMemo(() => products.filter(p => p.isCampaign), [products]);

  const selectedCategoryProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    if (selectedCategoryId === CAMPAIGN_CATEGORY_ID) return campaignProducts;

    return products.filter((product) => {
      const productCategoryIds = [
        ...(product.category || []),
        ...(product.categoryIds || []),
      ].map(String);

      const matchesId = productCategoryIds.includes(selectedCategoryId);
      const matchesName = selectedCategory 
        ? productCategoryIds.includes(selectedCategory.name)
        : false;

      return matchesId || matchesName;
    });
  }, [products, selectedCategoryId, selectedCategory, campaignProducts]);
  
  // --- KATEGORİ SWIPE (KAYDIRMA) MANTIĞI ---
  // Yatay kaydırmayı algılamak için PanResponder kullanıyoruz.
  // Dikey kaydırmayı engellememek için sadece yatay hareket baskın olduğunda çalışır.
  const swipeResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Yatay kaydırma miktarı dikeyden büyükse ve en az 20 birimse algıla
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderEnd: (e, gestureState) => {
        const { dx } = gestureState;
        if (Math.abs(dx) > 50) { // En az 50 birim kaydırıldıysa işlem yap
           const currentIndex = categories.findIndex(c => c.id === selectedCategoryId);
           
           if (dx > 0) { // Sağa kaydırma -> Önceki Kategori
               if (currentIndex > 0) {
                   const prevCat = categories[currentIndex - 1];
                   setSelectedCategoryId(prevCat.id);
                   // Üstteki kategori barını da kaydır
                   categoryListRef.current?.scrollTo({ x: (currentIndex - 1) * 100, animated: true });
               }
           } else { // Sola kaydırma -> Sonraki Kategori
               if (currentIndex < categories.length - 1) {
                   const nextCat = categories[currentIndex + 1];
                   setSelectedCategoryId(nextCat.id);
                   categoryListRef.current?.scrollTo({ x: (currentIndex + 1) * 100, animated: true });
               }
           }
        }
      }
    })
  ).current;

  // Sepet Mantığı
  const cartDetails = useMemo(() => 
    cart.map(item => {
      const p = products.find(x => x.id === item.id);
      return p ? { product: p, quantity: item.quantity } : null;
    }).filter(Boolean) as CartLineItem[], 
  [cart, products]);

  const cartTotal = useMemo(() => cartDetails.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartDetails]);

  // Floating Cart PanResponder
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

  // Render Helper
  const renderProductCard = (urun: Product) => {
    const qty = getQuantity(urun.id);
    return (
      <View key={urun.id} style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <Image source={urun.image ? { uri: urun.image } : placeholderImage} style={styles.productImage} />
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName} numberOfLines={2}>{urun.name}</Text>
          <View style={styles.productBottomRow}>
            <Text style={styles.productPrice}>{formatPrice(urun.price)}</Text>
            {qty === 0 ? (
              <TouchableOpacity style={styles.addButton} onPress={() => increase(urun.id)}>
                <Text style={styles.addButtonText}>EKLE</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => decrease(urun.id)} style={styles.counterBtn}>
                   <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{qty}</Text>
                <TouchableOpacity onPress={() => increase(urun.id)} style={styles.counterBtn}>
                   <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Navigasyon Fonksiyonları
  const handleCheckout = () => { if(cartDetails.length) setActiveScreen("address"); else Alert.alert("Sepet Boş"); };
  const handleSaveAddress = (data: any) => {
      const newAddr = { ...data, id: Date.now().toString() };
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
      setActiveScreen("address");
  };
  const handleSaveCard = (data: any) => {
      const newCard = { id: Date.now().toString(), label: data.holder, description: `**** ${data.number.slice(-4)}` };
      setPaymentMethods([...paymentMethods, newCard]);
      setSelectedPaymentId(newCard.id);
      setActiveScreen("payment");
  };

  const handleSubmitOrder = async () => {
    if (cartDetails.length === 0) {
      Alert.alert("Sepet boş", "Sipariş oluşturmak için ürün ekleyin.");
      return;
    }
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const selectedPayment = paymentMethods.find(p => p.id === selectedPaymentId);

    if (!selectedAddress || !selectedPayment) {
      Alert.alert("Eksik bilgi", "Lütfen teslimat adresi ve ödeme yöntemini seçin.");
      return;
    }

    const payload = buildOrderPayload(cartDetails, cartTotal, selectedAddress, selectedPayment);
    console.log("[OrderPayload] prepared:", payload);

    try {
      const response = await fetch("https://api.herevemarket.com/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Order request failed");
      }
      
      const result = await response.json();
      setOrderId(result.orderId || Math.floor(100000 + Math.random() * 900000).toString());
      clearCart();
      setActiveScreen("success");
      
    } catch (err) {
      console.error("[OrderSubmit] failed", err);
      Alert.alert("Bilgi", "Sipariş sunucuya iletilemedi ancak demo modunda onaylandı.");
      setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
      clearCart();
      setActiveScreen("success");
    }
  };

  // --- RENDER SCREENS ---
  if (activeScreen === "cart") return <CartScreen cartDetails={cartDetails} total={cartTotal} onBack={() => setActiveScreen("home")} onCheckout={handleCheckout} onIncrease={increase} onDecrease={decrease} />;
  if (activeScreen === "address") return <AddressScreen addresses={addresses} selectedId={selectedAddressId} onSelect={setSelectedAddressId} onBack={() => setActiveScreen("cart")} onContinue={() => setActiveScreen("payment")} onAddAddress={() => setActiveScreen("addAddress")} onDelete={(id: string) => setAddresses(addresses.filter(a => a.id !== id))} />;
  if (activeScreen === "addAddress") return <AddAddressScreen onSave={handleSaveAddress} onCancel={() => setActiveScreen("address")} />;
  if (activeScreen === "payment") return <PaymentScreen methods={paymentMethods} selectedId={selectedPaymentId} onSelect={setSelectedPaymentId} onBack={() => setActiveScreen("address")} onContinue={() => setActiveScreen("summary")} onAddCard={() => setActiveScreen("addCard")} onDelete={(id: string) => setPaymentMethods(paymentMethods.filter(p => p.id !== id))} />;
  if (activeScreen === "addCard") return <AddCardScreen onSave={handleSaveCard} onCancel={() => setActiveScreen("payment")} />;
  if (activeScreen === "summary") return <SummaryScreen cartDetails={cartDetails} total={cartTotal} address={addresses.find(a => a.id === selectedAddressId)} payment={paymentMethods.find(p => p.id === selectedPaymentId)} onBack={() => setActiveScreen("payment")} onSubmit={handleSubmitOrder} onPressLegal={(key: any) => Linking.openURL(LEGAL_URLS[key])} />;
  if (activeScreen === "success") return <SuccessScreen orderId={orderId} onReturnHome={() => setActiveScreen("home")} />;

  const isCategoryScreen = activeScreen === "category";
  const displayProducts = isCategoryScreen ? selectedCategoryProducts : campaignProducts;
  const pageTitle = isCategoryScreen ? (selectedCategory?.name || "Ürünler") : "Kampanyalı Fırsatlar";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: THEME.primary }}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
        
        <View style={styles.mainHeader}>
             <View style={styles.logoRow}>
                 {isCategoryScreen && (
                     <TouchableOpacity onPress={() => setActiveScreen("home")} style={{marginRight: 10, position: 'absolute', left: 16, zIndex: 10}}>
                         <Text style={{color: THEME.white, fontSize: 24}}>←</Text>
                     </TouchableOpacity>
                 )}
                 {/* Logo Büyütüldü */}
                 <View style={styles.headerLogoContainer}>
                    <Image source={require("../../assets/herevemarket2.png")} style={styles.headerLogo} resizeMode="contain" />
                 </View>
             </View>
             
             <View style={styles.categoryContainer}>
                <ScrollView 
                    ref={categoryListRef}
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 10}}
                >
                    {categories.map(cat => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[
                                styles.categoryPill, 
                                selectedCategoryId === cat.id && styles.categoryPillActive
                            ]}
                            onPress={() => {
                                setSelectedCategoryId(cat.id);
                                if (!isCategoryScreen) setActiveScreen("category");
                            }}
                        >
                            <Text style={[
                                styles.categoryPillText, 
                                selectedCategoryId === cat.id && styles.categoryPillTextActive
                            ]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
             </View>
        </View>

        {/* Swipe Responder Content Area'ya Eklendi */}
        <View style={styles.contentArea} {...swipeResponder.panHandlers}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                
                {!isCategoryScreen && (
                    <View style={styles.sliderSection}>
                        <View style={styles.sliderContainer}>
                            {/* Slider Düzeltmeleri: pagingEnabled kaldırıldı, snapToInterval eklendi */}
                            <ScrollView
                                ref={sliderRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={slideWidth}
                                decelerationRate="fast"
                                contentContainerStyle={{ paddingHorizontal: 0 }} 
                                onMomentumScrollEnd={(e) => setActiveDealIndex(Math.round(e.nativeEvent.contentOffset.x / slideWidth))}
                            >
                                {dailyDeals.map((img, i) => (
                                    <View key={i} style={[styles.slideItem, { width: slideWidth }]}>
                                        <Image source={img} style={styles.slideImage} resizeMode="cover" />
                                    </View>
                                ))}
                            </ScrollView>
                            <View style={styles.dotsContainer}>
                                {dailyDeals.map((_, i) => (
                                    <View key={i} style={[styles.dot, i === activeDealIndex && styles.dotActive]} />
                                ))}
                            </View>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandScroll} contentContainerStyle={{paddingHorizontal: 16}}>
                            {markalar.map((m, i) => (
                                <View key={i} style={styles.brandCircle}>
                                    <Image source={m.image} style={styles.brandImg} resizeMode="contain" />
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.productsSection}>
                    <Text style={styles.sectionTitle}>{pageTitle}</Text>
                    {displayProducts.length === 0 ? (
                        <Text style={styles.noProductText}>Bu kategoride henüz ürün bulunmuyor.</Text>
                    ) : (
                        <View style={styles.gridContainer}>
                            {displayProducts.map(renderProductCard)}
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>

        {cart.length > 0 && (
             <Animated.View style={[styles.floatingCart, { transform: pan.getTranslateTransform() }]} {...panResponder.panHandlers}>
                 <TouchableOpacity onPress={() => setActiveScreen("cart")} style={styles.floatingBtnInner}>
                     <View style={styles.cartIconWrapper}>
                        <Text style={{fontSize: 24}}>🛒</Text>
                        <View style={styles.badge}><Text style={styles.badgeText}>{cart.reduce((a,b)=>a+b.quantity,0)}</Text></View>
                     </View>
                     <View style={styles.floatingTotal}>
                         <Text style={styles.floatingTotalText}>{formatPrice(cartTotal)}</Text>
                     </View>
                 </TouchableOpacity>
             </Animated.View>
        )}
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  // Genel
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { padding: 16, paddingBottom: 100 },
  
  // Header
  mainHeader: { backgroundColor: THEME.primary, paddingBottom: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, position: 'relative' },
  headerLogoContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  // LOGO BOYUTU GÜNCELLENDİ
  headerLogo: { width: 220, height: 60 }, 
  headerBar: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    backgroundColor: THEME.white,
    borderBottomWidth: 1,
    borderColor: THEME.borderColor
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.textDark },
  headerCenterAbsolute: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: -1 },
  headerBackButton: { padding: 10 },
  headerBackText: { fontSize: 24, color: THEME.primary },
  
  // Content Wrapper
  contentArea: { flex: 1, backgroundColor: THEME.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -15, overflow: 'hidden' },

  // Kategoriler
  categoryContainer: { marginTop: 5 },
  categoryPill: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  categoryPillActive: { backgroundColor: THEME.secondary, borderColor: THEME.secondaryDark },
  categoryPillText: { color: THEME.white, fontWeight: '600' },
  categoryPillTextActive: { color: THEME.textDark, fontWeight: 'bold' },

  // Slider & Banner
  sliderSection: { paddingTop: 20 },
  sliderContainer: { height: 180, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', elevation: 5, shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, shadowRadius: 4, backgroundColor: THEME.white },
  slideItem: { height: 180 },
  slideImage: { width: '100%', height: '100%' },
  dotsContainer: { position: 'absolute', bottom: 10, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  dotActive: { backgroundColor: THEME.secondary, width: 20 },

  // Markalar
  brandScroll: { marginTop: 20, height: 80 },
  brandCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: THEME.white, marginRight: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2 },
  brandImg: { width: 40, height: 40 },

  // Ürünler Grid
  productsSection: { padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.textDark, marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  noProductText: { textAlign: 'center', color: THEME.textGray, marginTop: 20 },
  
  // Ürün Kartı
  productCard: { 
    width: (Dimensions.get("window").width - 48) / 2, 
    backgroundColor: THEME.white, 
    borderRadius: 12, 
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: 'hidden'
  },
  productImageContainer: { height: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 10 },
  productImage: { width: '80%', height: '80%', resizeMode: 'contain' },
  productInfoContainer: { padding: 10, backgroundColor: '#FAFAFA' },
  productName: { fontSize: 14, color: THEME.textDark, height: 40, fontWeight: '500' },
  productBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: THEME.primary },
  addButton: { backgroundColor: THEME.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  addButtonText: { fontSize: 12, fontWeight: 'bold', color: THEME.textDark },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.white, borderRadius: 6, borderWidth: 1, borderColor: THEME.borderColor },
  counterBtn: { paddingHorizontal: 8, paddingVertical: 2 },
  counterBtnText: { fontSize: 16, fontWeight: 'bold', color: THEME.primary },
  counterValue: { paddingHorizontal: 4, fontWeight: '600', fontSize: 14 },

  // Sepet Ekranı
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyStateIcon: { fontSize: 60, marginBottom: 20 },
  emptyStateTitle: { fontSize: 20, fontWeight: 'bold', color: THEME.textDark },
  emptyStateText: { textAlign: 'center', color: THEME.textGray, marginHorizontal: 40, marginTop: 10, marginBottom: 30 },
  cartListContainer: { padding: 16 },
  cartItemCard: { flexDirection: 'row', backgroundColor: THEME.white, borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  cartItemImage: { width: 60, height: 60, resizeMode: 'contain', marginRight: 12 },
  cartItemInfo: { flex: 1, justifyContent: 'center' },
  cartItemName: { fontSize: 14, fontWeight: '600', color: THEME.textDark },
  cartItemSinglePrice: { fontSize: 12, color: THEME.textGray, marginTop: 4 },
  cartItemActions: { alignItems: 'flex-end', justifyContent: 'space-between' },
  cartItemTotalPrice: { fontSize: 16, fontWeight: 'bold', color: THEME.primary, marginTop: 4 },
  quantityControlSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 8 },
  qtyBtnSmall: { padding: 6, width: 30, alignItems: 'center' },
  qtyBtnTextSmall: { fontSize: 16, fontWeight: 'bold', color: THEME.textDark },
  qtyTextSmall: { fontSize: 14, fontWeight: 'bold', width: 20, textAlign: 'center' },

  // Footer Alanları
  footerContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: THEME.white, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 20, shadowColor: "#000", shadowOpacity: 0.1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  footerLabel: { color: THEME.textGray, fontSize: 14 },
  footerValue: { color: THEME.textDark, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: THEME.borderColor, marginVertical: 12 },
  footerTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  footerTotalLabel: { fontSize: 18, fontWeight: 'bold', color: THEME.textDark },
  footerTotalValue: { fontSize: 18, fontWeight: 'bold', color: THEME.primary },
  
  // Butonlar
  primaryButton: { backgroundColor: THEME.secondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: THEME.textDark, fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: THEME.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  secondaryButtonText: { color: THEME.white, fontWeight: 'bold' },
  disabledButton: { backgroundColor: THEME.borderColor },
  dashedButton: { borderWidth: 1, borderColor: THEME.primary, borderStyle: 'dashed', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12, backgroundColor: THEME.primaryLight },
  dashedButtonText: { color: THEME.primary, fontWeight: 'bold' },
  footerSimple: { padding: 16, backgroundColor: THEME.white, borderTopWidth: 1, borderColor: THEME.borderColor },

  // Form & Input
  input: { backgroundColor: THEME.white, borderWidth: 1, borderColor: THEME.borderColor, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, color: THEME.textDark },
  inputLabel: { fontSize: 14, fontWeight: '600', color: THEME.textDark, marginBottom: 6 },
  
  // Seçim Kartları
  selectionCard: { backgroundColor: THEME.white, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: THEME.borderColor },
  selectionCardActive: { borderColor: THEME.secondary, backgroundColor: '#FFFDF5', borderWidth: 2 },
  selectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  radioIcon: { fontSize: 18, color: THEME.secondary, marginRight: 8 },
  selectionTitle: { fontWeight: 'bold', color: THEME.textDark },
  selectionDetail: { color: THEME.textGray, fontSize: 13, marginLeft: 24 },
  deleteText: { color: THEME.danger, fontSize: 12 },

  // Özet
  summaryCard: { backgroundColor: THEME.white, padding: 16, borderRadius: 12, marginBottom: 16 },
  summarySectionTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.primary, marginBottom: 8 },
  summaryTextBold: { fontWeight: '600', color: THEME.textDark },
  summaryText: { color: THEME.textGray, fontSize: 14 },
  summaryItemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryItemName: { fontSize: 14, color: THEME.textDark, flex: 1 },
  summaryItemPrice: { fontWeight: '600', color: THEME.textDark },
  legalContainer: { marginTop: 20, alignItems: 'center' },
  legalLink: { color: THEME.textLight, fontSize: 12, textDecorationLine: 'underline', marginBottom: 6 },
  legalLogosRow: { flexDirection: 'row', marginTop: 12, justifyContent: 'center' },
  paymentLogo: { width: 50, height: 30, marginHorizontal: 6 },

  // Success
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: THEME.white },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: THEME.textDark, marginBottom: 12 },
  successText: { fontSize: 16, textAlign: 'center', color: THEME.textGray, marginBottom: 24 },
  successSubText: { fontSize: 14, textAlign: 'center', color: THEME.textLight, marginBottom: 40 },

  // Floating Cart
  floatingCart: { position: 'absolute', right: 0, left: 0 },
  floatingBtnInner: { flexDirection: 'row', backgroundColor: THEME.secondary, marginHorizontal: 16, borderRadius: 16, padding: 12, alignItems: 'center', justifyContent: 'space-between', elevation: 10, shadowColor: THEME.secondary, shadowOffset: {width:0, height:4}, shadowOpacity: 0.5 },
  cartIconWrapper: { flexDirection: 'row', alignItems: 'center' },
  badge: { backgroundColor: THEME.white, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  badgeText: { color: THEME.primary, fontWeight: 'bold', fontSize: 12 },
  floatingTotal: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  floatingTotalText: { color: THEME.textDark, fontWeight: 'bold', fontSize: 16 },
});