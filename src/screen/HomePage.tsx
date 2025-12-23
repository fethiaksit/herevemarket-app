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
} from "react-native";
import { styles } from "../styles/home.styles";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/cartPrice";
import { getProducts, ProductDto } from "../services/api/products";
import { getCategories, CategoryDto } from "../services/api/categories";

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
  customer: {
    title: string;
    detail: string;
    note?: string;
  };
  paymentMethod: {
    id: string;
    label?: string;
  };
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

const CART_FOOTER_HEIGHT = 200;
const CAMPAIGN_CATEGORY_ID = "campaign";
const CAMPAIGN_CATEGORY_NAME = "Kampanyalı Ürünler";
const LEGAL_URLS = {
  about: "https://herevemarket.com/hakkimizda",
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
    name: "Su",
    price: 50,
    image: "https://cdn.example.com/ayran.png",
    imageUrl: "https://cdn.example.com/ayran.png",
    category: ["İçecek", "Temel Gıda"],
    isCampaign: true,
  },
];

const fallbackCategories: CategoryDto[] = [
  {
    id: "İçecek",
    name: "İçecek",
    isActive: true,
    createdAt: "2025-12-15T17:57:42.272Z",
  },
  {
    id: "Temel Gıda",
    name: "Temel Gıda",
    isActive: true,
    createdAt: "2025-12-15T17:57:42.272Z",
  },
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

const initialAddresses: Address[] = [


];

const initialPaymentMethods: PaymentMethod[] = [

  {
    id: "card",
    label: "Kredi Kartı",
    description: "Visa - **** 4242",
  },

];

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
    <View style={[styles.cartContainer, { paddingBottom: CART_FOOTER_HEIGHT }]}>
      <View style={styles.cartHero}>
        <View style={styles.cartHeroBackdrop} />

        <View style={styles.cartHeader}>
          <TouchableOpacity style={styles.cartBackButton} onPress={onBack}>
            <Text style={styles.cartBackText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.cartTitle}>Sepetim</Text>
            <Text style={styles.cartSubtitle}>Teslimat için hazır</Text>
          </View>
        </View>

        <View style={styles.cartBadgeRow}>
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>Hereve Market</Text>
          </View>
          <View style={styles.cartEtaPill}>
            <Text style={styles.cartEtaText}>Hemen Kargo</Text>
          </View>
        </View>

        <Text style={styles.cartHeroTitle}>Seçtiğin ürünler hazır</Text>
        <Text style={styles.cartHeroText}>
          Ödemeyi tamamlayarak siparişini hemen yola çıkar.
        </Text>
      </View>

      {cartDetails.length === 0 ? (
        <View style={[styles.cartEmpty, { paddingBottom: CART_FOOTER_HEIGHT }]}>
          <Text style={styles.cartEmptyIcon}>🛒</Text>
          <Text style={styles.cartEmptyTitle}>Sepetiniz boş</Text>
          <Text style={styles.cartEmptyText}>
            Favori ürünlerinizi ekleyip siparişinizi tamamlayın.
          </Text>
          <TouchableOpacity style={styles.cartBackButtonAlt} onPress={onBack}>
            <Text style={styles.cartBackTextAlt}>Alışverişe Başla</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cartSectionCard}>
          <Text style={styles.cartSectionTitle}>Ürünler</Text>

          <ScrollView
            style={styles.cartList}
            contentContainerStyle={[
              styles.cartListContent,
              { paddingBottom: CART_FOOTER_HEIGHT },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {cartDetails.map((item) => {
              const { product } = item;
              return (
                <View key={product.id} style={styles.cartItem}>
                  <Image
                    source={
                      product.image
                        ? { uri: product.image }
                        : placeholderImage
                    }
                    style={styles.cartItemImage}
                  />
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <View style={styles.cartItemMeta}>
                      <Text style={styles.cartItemPrice}>
                        {formatPrice(product.price)}
                      </Text>
                    </View>
                    <View style={styles.cartItemActions}>
                      <View style={styles.cartQuantityControls}>
                        <TouchableOpacity
                          style={styles.cartQuantityButton}
                          onPress={() => onDecrease(product.id)}
                        >
                          <Text style={styles.cartQuantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.cartQuantityValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.cartQuantityButton}
                          onPress={() => onIncrease(product.id)}
                        >
                          <Text style={styles.cartQuantityButtonText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.cartItemTotal}>
                        {formatPrice(product.price * item.quantity)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={[styles.cartFooter, { height: CART_FOOTER_HEIGHT }]}>
        <View style={styles.cartFooterRow}>
          <Text style={styles.cartFooterLabel}>Ara Toplam</Text>
          <Text style={styles.cartFooterValue}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.cartFooterRow}>
          <Text style={styles.cartFooterLabel}>Teslimat</Text>
          <Text style={styles.cartFooterValue}>Ücretsiz</Text>
        </View>
        <View style={styles.cartFooterDivider} />
        <View style={styles.cartFooterRow}>
          <Text style={styles.cartFooterTotalLabel}>Genel Toplam</Text>
          <Text style={styles.cartFooterTotalValue}>{formatPrice(total)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.cartFooterButton,
            isCheckoutDisabled && styles.checkoutButtonDisabled,
          ]}
          onPress={onCheckout}
          disabled={isCheckoutDisabled}
        >
          <Text
            style={[
              styles.cartFooterButtonText,
              isCheckoutDisabled && styles.checkoutButtonTextDisabled,
            ]}
          >
            Siparişi Tamamla
          </Text>
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
}: {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onAddAddress: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.checkoutScreenContainer}>
      <View style={styles.checkoutHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cartBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.checkoutTitle}>Teslimat Adresi</Text>
      </View>

      <Text style={styles.checkoutSubtitle}>
        Siparişini nereye teslim edelim?
      </Text>

      <View style={styles.checkoutCardGroup}>
        {addresses.map((address) => {
          const isSelected = selectedId === address.id;
          return (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.checkoutCard,
                isSelected && styles.checkoutCardSelected,
              ]}
              onPress={() => onSelect(address.id)}
            >
              <View style={styles.checkoutCardHeader}>
                <Text style={styles.checkoutCardTitle}>{address.title}</Text>
                <View style={styles.checkoutCardActions}>
                  {isSelected ? (
                    <Text style={styles.checkoutPill}>Seçildi</Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => onDelete(address.id)}
                    style={styles.checkoutDeleteButton}
                  >
                    <Text style={styles.checkoutDeleteText}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.checkoutCardText}>{address.detail}</Text>
              {address.note ? (
                <Text style={styles.checkoutCardNote}>{address.note}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onAddAddress}
      >
        <Text style={styles.secondaryButtonText}>+ Yeni Adres Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Devam Et</Text>
      </TouchableOpacity>
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
}: {
  methods: PaymentMethod[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
  onAddCard: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.checkoutScreenContainer}>
      <View style={styles.checkoutHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cartBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.checkoutTitle}>Ödeme Yöntemi</Text>
      </View>

      <Text style={styles.checkoutSubtitle}>
        Ödeme yöntemi seçimini yap ve onayla.
      </Text>

      <View style={styles.checkoutCardGroup}>
        {methods.map((method) => {
          const isSelected = method.id === selectedId;
          return (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.checkoutCard,
                isSelected && styles.checkoutCardSelected,
              ]}
              onPress={() => onSelect(method.id)}
            >
              <View style={styles.checkoutCardHeader}>
                <Text style={styles.checkoutCardTitle}>{method.label}</Text>
                <View style={styles.checkoutCardActions}>
                  {isSelected ? (
                    <Text style={styles.checkoutPill}>Seçildi</Text>
                  ) : null}
                  <TouchableOpacity
                    onPress={() => onDelete(method.id)}
                    style={styles.checkoutDeleteButton}
                  >
                    <Text style={styles.checkoutDeleteText}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.checkoutCardText}>{method.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.secondaryButton} onPress={onAddCard}>
        <Text style={styles.secondaryButtonText}>+ Yeni Kart Ekle</Text>
      </TouchableOpacity>
  
      <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
        <Text style={styles.primaryButtonText}>Ödemeyi Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddAddressScreen({
  onSave,
  onCancel,
}: {
  onSave: (address: Omit<Address, "id">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [note, setNote] = useState("");

  const isSaveDisabled = title.trim() === "" || detail.trim() === "";

  return (
    <View style={styles.checkoutScreenContainer}>
      <View style={styles.checkoutHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cartBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.checkoutTitle}>Yeni Adres Ekle</Text>
      </View>

      <Text style={styles.checkoutSubtitle}>
        Teslimat adresi bilgilerini doldurup kaydet.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Adres Başlığı</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Ev, Ofis, Yazlık"
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Adres Detayı</Text>
        <TextInput
          value={detail}
          onChangeText={setDetail}
          placeholder="Mahalle, sokak, kapı numarası..."
          style={[styles.input, styles.inputMultiline]}
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Adres Notu (Opsiyonel)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Kapı şifresi, apartman adı..."
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isSaveDisabled && styles.buttonDisabled]}
        onPress={() =>
          onSave({ title: title.trim(), detail: detail.trim(), note: note.trim() })
        }
        disabled={isSaveDisabled}
      >
        <Text
          style={[styles.primaryButtonText, isSaveDisabled && styles.buttonTextDisabled]}
        >
          Kaydet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostButton} onPress={onCancel}>
        <Text style={styles.ghostButtonText}>İptal</Text>
      </TouchableOpacity>
    </View>
  );
}

function AddCardScreen({
  onSave,
  onCancel,
}: {
  onSave: (card: { holder: string; number: string; expiry: string; cvv: string }) => void;
  
  onCancel: () => void;
}) {
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleExpiryChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
    const month = digitsOnly.slice(0, 2);
    const year = digitsOnly.slice(2, 4);
    if (year.length > 0) {
      setExpiry(`${month}/${year}`);
    } else {
      setExpiry(month);
    }
  };

  const handleNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
    setNumber(digitsOnly);
  };

  const handleCvvChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
    setCvv(digitsOnly);
  };

  const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const isSaveDisabled =
    holder.trim() === "" || number.length !== 16 || cvv.length !== 3 || !isExpiryValid;

  return (
    <View style={styles.checkoutScreenContainer}>
      <View style={styles.checkoutHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cartBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.checkoutTitle}>Yeni Kart Ekle</Text>
      </View>

      <Text style={styles.checkoutSubtitle}>
        Kart bilgilerini gir ve kaydederek ödeme yöntemini ekle.
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Kart Üzerindeki İsim</Text>
        <TextInput
          value={holder}
          onChangeText={setHolder}
          placeholder="Ad Soyad"
          style={styles.input}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.inputLabel}>Kart Numarası</Text>
        <TextInput
          value={number}
          onChangeText={handleNumberChange}
          placeholder="16 haneli kart numarası"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={16}
        />
      </View>

      <View style={[styles.formGroup, styles.inlineFields]}>
        <View style={styles.inlineFieldItem}>
          <Text style={styles.inputLabel}>Son Kullanma (MM/YY)</Text>
          <TextInput
            value={expiry}
            onChangeText={handleExpiryChange}
            placeholder="MM/YY"
            style={styles.input}
            maxLength={5}
          />
        </View>
        <View style={styles.inlineFieldItem}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            value={cvv}
            onChangeText={handleCvvChange}
            placeholder="3 haneli"
            style={styles.input}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isSaveDisabled && styles.buttonDisabled]}
        onPress={() =>
          onSave({
            holder: holder.trim(),
            number,
            expiry: expiry.trim(),
            cvv,
          })
        }
        disabled={isSaveDisabled}
      >
        <Text
          style={[styles.primaryButtonText, isSaveDisabled && styles.buttonTextDisabled]}
        >
          Kaydet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.ghostButton} onPress={onCancel}>
        <Text style={styles.ghostButtonText}>İptal</Text>
      </TouchableOpacity>
      <View style={styles.legalLogosRow}>
        <Image
          source={require("../../assets/visa.png")}
          style={styles.legalLogo}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/mastercard.png")}
          style={styles.legalLogo}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/iyzico_ile_ode_colored.png")}
          style={[styles.legalLogo, styles.legalLogoWide]}
          resizeMode="contain"
        />
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
}: {
  cartDetails: CartLineItem[];
  total: number;
  address: Address | undefined;
  payment: PaymentMethod | undefined;
  onBack: () => void;
  onSubmit: () => void;
  onPressLegal: (key: keyof typeof LEGAL_URLS) => void;
}) {
  const isSubmitDisabled =
    cartDetails.length === 0 || !address || !payment || total <= 0;

  return (
    <View style={styles.checkoutScreenContainer}>
      <View style={styles.checkoutHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.cartBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.checkoutTitle}>Sipariş Özeti</Text>
      </View>

      <Text style={styles.checkoutSubtitle}>
        Sipariş detayı ve teslimat bilgilerini kontrol et.
      </Text>

      <View style={styles.summarySection}>
        <Text style={styles.checkoutSectionTitle}>Adres</Text>
        {address ? (
          <View style={styles.summaryCard}>
            <Text style={styles.checkoutCardTitle}>{address.title}</Text>
            <Text style={styles.checkoutCardText}>{address.detail}</Text>
            {address.note ? (
              <Text style={styles.checkoutCardNote}>{address.note}</Text>
            ) : null}
          </View>
        ) : (
          <Text style={styles.checkoutCardText}>Adres seçilmedi.</Text>
        )}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.checkoutSectionTitle}>Ödeme</Text>
        {payment ? (
          <View style={styles.summaryCard}>
            <Text style={styles.checkoutCardTitle}>{payment.label}</Text>
            <Text style={styles.checkoutCardText}>{payment.description}</Text>
          </View>
        ) : (
          <Text style={styles.checkoutCardText}>Ödeme yöntemi seçilmedi.</Text>
        )}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.checkoutSectionTitle}>Ürünler</Text>
        <View style={styles.summaryCard}>
          {cartDetails.map((item) => (
            <View key={item.product.id} style={styles.summaryRow}>
              <Text style={styles.summaryItemName}>{item.product.name}</Text>
              <Text style={styles.summaryItemQty}>{item.quantity} adet</Text>
              <Text style={styles.summaryItemPrice}>
                {formatPrice(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.cartDivider} />

          <View style={styles.summaryTotalRow}>
            <Text style={styles.cartGrandTotalLabel}>Toplam</Text>
            <Text style={styles.cartGrandTotalValue}>{formatPrice(total)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isSubmitDisabled && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={isSubmitDisabled}
      >
        <Text
          style={[styles.primaryButtonText, isSubmitDisabled && styles.buttonTextDisabled]}
        >
          Siparişi Gönder
        </Text>
      </TouchableOpacity>

      {/* --- NEW: Legal & Payment Info Section --- */}
      <LegalPaymentInfoSection onPressLegal={onPressLegal} />
    </View>
  );
}

// --- NEW: Legal & Payment Info Section ---
function LegalPaymentInfoSection({
  onPressLegal,
}: {
  onPressLegal: (key: keyof typeof LEGAL_URLS) => void;
}) {
  return (
    <View style={styles.legalSection}>
      <View style={styles.legalLinksRow}>
        <View style={styles.legalLinksColumn}>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => onPressLegal("about")}
          >
            <Text style={styles.legalLinkText}>Hakkımızda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => onPressLegal("ssl")}
          >
            <Text style={styles.legalLinkText}>SSL Sertifikası</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => onPressLegal("returns")}
          >
            <Text style={styles.legalLinkText}>Teslimat ve İade Şartları</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.legalLinksColumn}>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => onPressLegal("privacy")}
          >
            <Text style={styles.legalLinkText}>Gizlilik Sözleşmesi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.legalLink}
            onPress={() => onPressLegal("distance")}
          >
            <Text style={styles.legalLinkText}>Mesafeli Satış Sözleşmesi</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.legalCaption}>Güvenli ödeme altyapısı</Text>
      <View style={styles.legalLogosRow}>
        <Image
          source={require("../../assets/visa.png")}
          style={styles.legalLogo}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/mastercard.png")}
          style={styles.legalLogo}
          resizeMode="contain"
        />
        <Image
          source={require("../../assets/iyzico_ile_ode_colored.png")}
          style={[styles.legalLogo, styles.legalLogoWide]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

function SuccessScreen({ orderId, onReturnHome }: { orderId: string; onReturnHome: () => void }) {
  return (
    <View style={styles.successContainer}>
      <Text style={styles.successIcon}>✅</Text>
      <Text style={styles.successTitle}>Siparişin Alındı</Text>
      <Text style={styles.successText}>
        #{orderId} numaralı siparişini hazırlamaya başladık. Kuryemiz yola çıkınca
        sana haber vereceğiz.
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={onReturnHome}>
        <Text style={styles.primaryButtonText}>Anasayfaya Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const maskCardNumber = (number: string) => {
  const last4 = number.slice(-4);
  return "**** **** **** " + last4;
};

const buildOrderPayload = (
  cartDetails: CartLineItem[],
  totalPrice: number,
  address?: Address,
  payment?: PaymentMethod
): OrderPayload => {
  if (!cartDetails.length) {
    throw new Error("Cart is empty");
  }

  if (!address) {
    throw new Error("Delivery address is missing");
  }

  if (!payment) {
    throw new Error("Payment method is missing");
  }

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


export default function HomePage() {
  const { cart, increase, decrease, getQuantity, clearCart } = useCart();
  const [activeScreen, setActiveScreen] = useState<Screen>("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    CAMPAIGN_CATEGORY_ID
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsMessage, setProductsMessage] = useState<string | null>(null);
  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
    initialPaymentMethods
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    initialAddresses[0]?.id ?? ""
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    initialPaymentMethods[0]?.id ?? ""
  );
  const [orderId, setOrderId] = useState<string>("");
  const handleLegalPress = useCallback(
    async (key: keyof typeof LEGAL_URLS) => {
      const url = LEGAL_URLS[key];
      if (!url) {
        return;
      }

      try {
        const supported = await Linking.canOpenURL(url);
        if (!supported) {
          Alert.alert("Bağlantı açılamadı", "Bağlantı desteklenmiyor.");
          return;
        }

        await Linking.openURL(url);
      } catch (error) {
        console.error("[HomePage] failed to open legal link", error);
        Alert.alert("Bağlantı açılamadı", "Lütfen daha sonra tekrar deneyin.");
      }
    },
    []
  );

  const cartDetails = useMemo<CartLineItem[]>(
    () =>
      cart
        .map((item) => {
          const product = products.find((urun) => urun.id === item.id);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter((item): item is CartLineItem => Boolean(item)),
    [cart, products]
  );

  const cartTotal = useMemo(
    () =>
      cartDetails.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cartDetails]
  );

  const sliderRef = useRef<ScrollView | null>(null);
  const categoryProductListRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        setProductsMessage(null);
        setLoading(true);
        const incomingProducts = await getProducts();
        if (!incomingProducts || incomingProducts.length === 0) {
          setProducts([]);
          setProductsMessage("Ürün bulunamadı");
        } else {
          setProducts(incomingProducts);
        }
      } catch (err) {
        console.error("[HomePage] failed to fetch products", err);
        setError("Ürünler yüklenirken bir hata oluştu. Yerel liste gösteriliyor.");
        setProducts(fallbackProducts);
        setProductsMessage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesError(null);
        setCategoriesLoading(true);
        const incomingCategories = await getCategories();
        const activeCategories = (incomingCategories ?? []).filter(
          (category) => category.isActive
        );
        const nextCategories = ensureCampaignCategory(
          activeCategories.length === 0 ? fallbackCategories : activeCategories
        );
        setCategories(nextCategories);
      } catch (err) {
        console.error("[HomePage] failed to fetch categories", err);
        setCategoriesError(
          "Kategoriler yüklenirken bir hata oluştu. Yerel liste gösteriliyor."
        );
        setCategories(ensureCampaignCategory(fallbackCategories));
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(CAMPAIGN_CATEGORY_ID);
    }
  }, [categories, selectedCategoryId]);

  const campaignProducts = useMemo(
    () => products.filter((product) => product.isCampaign === true),
    [products]
  );

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  const selectedCategoryProducts = useMemo(() => {
    if (!selectedCategoryId) return [];
    if (selectedCategoryId === CAMPAIGN_CATEGORY_ID) return campaignProducts;

    return products.filter((product) => {
      const productCategoryIds = [
        ...(product.category ?? []),
        ...(product.categoryIds ?? []),
      ].map(String);

      return (
        productCategoryIds.includes(selectedCategoryId) ||
        (!!selectedCategory && productCategoryIds.includes(selectedCategory.name))
      );
    });
  }, [campaignProducts, products, selectedCategory, selectedCategoryId]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveScreen("category");
  };

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === selectedCategoryId) return;
    setSelectedCategoryId(categoryId);
  };

  useEffect(() => {
    if (activeScreen !== "category") return;
    categoryProductListRef.current?.scrollTo({ y: 0, animated: false });
  }, [activeScreen, selectedCategoryId]);

  const renderProductCard = (urun: Product) => {
    const quantity = getQuantity(urun.id);

    return (
      <View key={urun.id} style={styles.productCard}>
        <Image
          source={urun.image ? { uri: urun.image } : placeholderImage}
          style={styles.productImage}
        />

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {urun.name}
          </Text>

          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{formatPrice(urun.price)}</Text>

            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => increase(urun.id)}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => decrease(urun.id)}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.counterValue}>{quantity}</Text>

                <TouchableOpacity
                  onPress={() => increase(urun.id)}
                  style={styles.counterButton}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const { width, height } = Dimensions.get("window");
  const slideWidth = width - 32;

  const CART_SIZE = 64;
  const MARGIN = 16;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDealIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % dailyDeals.length;
        sliderRef.current?.scrollTo({
          x: nextIndex * slideWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [slideWidth]);

  const pan = useRef(
    new Animated.ValueXY({
      x: MARGIN,
      y: height - CART_SIZE - MARGIN - 20,
    })
  ).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,

      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 5 || Math.abs(g.dy) > 5,

      onPanResponderGrant: () => {
        pan.extractOffset();
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {},
    })
  ).current;

  const renderFloatingCart = () => {
    if (cart.length === 0) return null;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.floatingCart,
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
      >
        <TouchableOpacity onPress={() => setActiveScreen("cart")}>
          <Text style={styles.floatingCartIcon}>🛒</Text>

          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  const selectedPayment = useMemo(
    () => paymentMethods.find((p) => p.id === selectedPaymentId),
    [paymentMethods, selectedPaymentId]
  );

  const handleCheckout = () => {
    if (cartDetails.length === 0) {
      Alert.alert("Sepet boş", "Ödeme adımlarına geçmek için ürün ekleyin.");
      return;
    }
    setActiveScreen("address");
  };

  const handleAddressContinue = () => {
    if (!selectedAddress) {
      Alert.alert("Adres seçimi", "Devam etmek için bir adres seçin.");
      return;
    }
    setActiveScreen("payment");
  };

  const handlePaymentContinue = () => {
    if (!selectedPayment) {
      Alert.alert("Ödeme yöntemi", "Devam etmek için bir ödeme yöntemi seçin.");
      return;
    }
    setActiveScreen("summary");
  };
  const handleReturnToPayment = () => setActiveScreen("payment");

  const handleSaveAddress = (address: Omit<Address, "id">) => {
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      ...address,
      note: address.note?.trim() ? address.note : undefined,
    };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setActiveScreen("address");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => {
      const updated = prev.filter((address) => address.id !== id);
      if (selectedAddressId === id) {
        setSelectedAddressId(updated[0]?.id ?? "");
      } else if (updated.length === 0) {
        setSelectedAddressId("");
      }
      return updated;
    });
  };

  const handleSaveCard = (card: {
    holder: string;
    number: string;
    expiry: string;
    cvv: string;
  }) => {
    const newMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      label: card.holder,
      description: `${maskCardNumber(card.number)} | SKT: ${card.expiry}`,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    setSelectedPaymentId(newMethod.id);
    setActiveScreen("payment");
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => {
      const updated = prev.filter((method) => method.id !== id);
      if (selectedPaymentId === id) {
        setSelectedPaymentId(updated[0]?.id ?? "");
      } else if (updated.length === 0) {
        setSelectedPaymentId("");
      }
      return updated;
    });
  };

  const handleSubmitOrder = async () => {
    if (cartDetails.length === 0) {
      Alert.alert("Sepet boş", "Sipariş oluşturmak için ürün ekleyin.");
      return;
    }

    if (!selectedAddress || !selectedPayment) {
      Alert.alert(
        "Eksik bilgi",
        "Lütfen teslimat adresi ve ödeme yöntemini seçin."
      );
      return;
    }
    try {
      const payload = buildOrderPayload(
        cartDetails,
        cartTotal,
        selectedAddress,
        selectedPayment
      );
    
      console.log("[OrderPayload] prepared order payload", payload);
    
      const response = await fetch("https://api.herevemarket.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    
      if (!response.ok) {
        throw new Error("Order request failed");
      }
    
      const result = await response.json();
      setOrderId(result.orderId); // backend’den gelmeli
    
      setActiveScreen("success");
      clearCart();
    } catch (err) {
      console.error("[OrderSubmit] failed", err);
      Alert.alert(
        "Sipariş başarısız",
        "Sipariş gönderilirken bir hata oluştu."
      );
    }
    const newOrderId = (Math.floor(Math.random() * 900000) + 100000).toString();
    setOrderId(newOrderId);
    setActiveScreen("success");
    clearCart();
  };


  const handleReturnHome = () => {
    setActiveScreen("home");
  };

  if (activeScreen === "cart") {
    return (
      <CartScreen
        cartDetails={cartDetails}
        total={cartTotal}
        onBack={() => setActiveScreen("home")}
        onCheckout={handleCheckout}
        onIncrease={increase}
        onDecrease={decrease}
      />
    );
  }

  if (activeScreen === "address") {
    return (
      <AddressScreen
        addresses={addresses}
        selectedId={selectedAddressId}
        onSelect={setSelectedAddressId}
        onBack={() => setActiveScreen("cart")}
        onContinue={handleAddressContinue}
        onAddAddress={() => setActiveScreen("addAddress")}
        onDelete={handleDeleteAddress}
      />
    );
  }

  if (activeScreen === "addAddress") {
    return (
      <AddAddressScreen
        onSave={handleSaveAddress}
        onCancel={() => setActiveScreen("address")}
      />
    );
  }

  if (activeScreen === "payment") {
    return (
      <PaymentScreen
        methods={paymentMethods}
        selectedId={selectedPaymentId}
        onSelect={setSelectedPaymentId}
        onBack={() => setActiveScreen("address")}
        onContinue={handlePaymentContinue}
        onAddCard={() => setActiveScreen("addCard")}
        onDelete={handleDeletePayment}
      />
    );
  }

  if (activeScreen === "addCard") {
    return (
      <AddCardScreen
        onSave={handleSaveCard}
        onCancel={() => setActiveScreen("payment")}
      />
    );
  }

  if (activeScreen === "summary") {
    return (
      <SummaryScreen
        cartDetails={cartDetails}
        total={cartTotal}
        address={selectedAddress}
        payment={selectedPayment}
        onBack={handleReturnToPayment}
        onSubmit={handleSubmitOrder}
        onPressLegal={handleLegalPress}
      />
    );
  }

  if (activeScreen === "success") {
    return <SuccessScreen orderId={orderId} onReturnHome={handleReturnHome} />;
  }

  if (activeScreen === "category") {
    return (
      <View style={styles.page}>
        <View style={styles.categoryStickyHeader}>
          <TouchableOpacity
            style={styles.categoryBackButton}
            onPress={() => setActiveScreen("home")}
          >
            <Text style={styles.categoryBackText}>←</Text>
          </TouchableOpacity>

          <ScrollView
            horizontal
            style={styles.categoryHeaderScroll}
            contentContainerStyle={styles.categoryHeaderRow}
            showsHorizontalScrollIndicator={false}
          >
            {categoriesLoading ? (
              <Text style={styles.cartEmptyText}>Kategoriler yükleniyor...</Text>
            ) : categoriesError ? (
              <Text style={styles.cartEmptyText}>{categoriesError}</Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    selectedCategoryId === cat.id && styles.categoryCardActive,
                  ]}
                  onPress={() => handleCategoryChange(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategoryId === cat.id && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <ScrollView
          ref={categoryProductListRef}
          style={styles.categoryProductsScroll}
          contentContainerStyle={styles.categoryProductsContainer}
        >
          <Text style={styles.sectionTitle}>
            {selectedCategory?.name ?? "Kategori Ürünleri"}
          </Text>

          {loading && <Text style={styles.cartEmptyText}>Ürünler yükleniyor...</Text>}

          {error && !loading && <Text style={styles.cartEmptyText}>{error}</Text>}

          {!loading && !error && productsMessage && (
            <Text style={styles.cartEmptyText}>{productsMessage}</Text>
          )}

          {!loading && !error && !productsMessage && selectedCategoryProducts.length === 0 && (
            <Text style={styles.cartEmptyText}>Bu kategoride ürün bulunamadı.</Text>
          )}

          {!loading && !error && !productsMessage && selectedCategoryProducts.length > 0 &&
            selectedCategoryProducts.map(renderProductCard)}
        </ScrollView>

        {renderFloatingCart()}
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/herevemarket2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.categoryBar}>
          <ScrollView
            horizontal
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryRow}
            showsHorizontalScrollIndicator={false}
          >
            {categoriesLoading ? (
              <Text style={styles.cartEmptyText}>Kategoriler yükleniyor...</Text>
            ) : categoriesError ? (
              <Text style={styles.cartEmptyText}>{categoriesError}</Text>
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    selectedCategoryId === cat.id && styles.categoryCardActive,
                  ]}
                  onPress={() => handleCategoryPress(cat.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategoryId === cat.id && styles.categoryTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.bannerWrapper}>
          <ScrollView
            ref={sliderRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / slideWidth
              );
              setActiveDealIndex(index);
            }}
          >
            {dailyDeals.map((image, index) => (
              <View key={index} style={[styles.banner, { width: slideWidth }]}>
                <Image
                  source={image}
                  style={styles.bannerImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.bannerDots}>
            {dailyDeals.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerDot,
                  index === activeDealIndex && styles.bannerDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <ScrollView horizontal style={styles.brandScroll}>
          {markalar.map((m) => (
            <TouchableOpacity key={m.name} style={styles.brandChip}>
              <Image
                source={m.image}
                style={styles.brandImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.products}>
          <Text style={styles.sectionTitle}>Kampanyalı Ürünler</Text>

          {loading && <Text style={styles.cartEmptyText}>Ürünler yükleniyor...</Text>}

          {error && !loading && <Text style={styles.cartEmptyText}>{error}</Text>}

          {!loading && !error && productsMessage && (
            <Text style={styles.cartEmptyText}>{productsMessage}</Text>
          )}

          {!loading && !error && !productsMessage && campaignProducts.length === 0 && (
            <Text style={styles.cartEmptyText}>Kampanyalı ürün bulunamadı.</Text>
          )}

          {!loading && !error && !productsMessage && campaignProducts.length > 0 &&
            campaignProducts.map(renderProductCard)}
        </View>
      </ScrollView>

      {renderFloatingCart()}
    </View>
  );
}
