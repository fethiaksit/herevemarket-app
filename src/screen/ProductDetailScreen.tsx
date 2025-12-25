import React from "react";
import { 
  Image, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  SafeAreaView 
} from "react-native";

// Ana dosyadaki Type ile uyumlu olması için
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  barcode?: string;
  stock?: number;
  inStock?: boolean;
  description?: string;
}

type Props = {
  product: Product;
  quantity?: number; // Sepetteki adet sayısı
  onBack: () => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  onGoToCart?: () => void; // YENİ: Sepete git fonksiyonu
};

// Tema renkleri
const THEME = {
  primary: "#004AAD",
  secondary: "#FFD700",
  textDark: "#1F2937",
  white: "#FFFFFF",
  background: "#F8F9FA",
  danger: "#EF4444",
  success: "#10B981",
  borderColor: "#E5E7EB",
};

export const ProductDetailScreen: React.FC<Props> = ({ 
  product, 
  quantity = 0, 
  onBack, 
  onIncrease = () => undefined, 
  onDecrease = () => undefined,
  onGoToCart = () => undefined // Props'a eklendi
}) => {
  const isOutOfStock = product.stock === 0;
  const description =
    product.description && product.description.trim().length > 0
      ? product.description
      : "Bu ürün için açıklama bulunmamaktadır.";

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Detayı</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Ürün Görseli */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.image, { backgroundColor: '#eee' }]} />
          )}
        </View>

        {/* Bilgi Kartı */}
        <View style={styles.infoCard}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>
                {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}
            </Text>
            {isOutOfStock ? (
              <View style={[styles.stockBadge, styles.bgRed]}>
                <Text style={[styles.stockText, styles.stockTextOutOfStock]}>Tükendi</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.divider} />

          {product.barcode && (
            <Text style={styles.meta}>Barkod: <Text style={styles.metaValue}>{product.barcode}</Text></Text>
          )}
          
          <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
      </ScrollView>

      {/* Alt Aksiyon Alanı */}
      <View style={styles.footer}>
        {quantity === 0 ? (
          // DURUM 1: Sepette hiç yok -> Sadece "Sepete Ekle"
          <TouchableOpacity 
            style={[styles.addButton, isOutOfStock && styles.disabledButton]} 
            onPress={() => onIncrease(product.id)}
            disabled={isOutOfStock}
          >
            <Text style={[styles.addButtonText, isOutOfStock && { color: '#999' }]}>
              {isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
            </Text>
          </TouchableOpacity>
        ) : (
          // DURUM 2: Sepette var -> Hem "Arttır/Azalt" Hem "Sepete Git"
          <View style={styles.activeFooterRow}>
            
            {/* Sol: Arttır / Azalt */}
            <View style={styles.counterWrapper}>
                <TouchableOpacity style={styles.counterBtnSmall} onPress={() => onDecrease(product.id)}>
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValueText}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.counterBtnSmall, isOutOfStock && styles.counterBtnDisabled]}
                  onPress={() => onIncrease(product.id)}
                  disabled={isOutOfStock}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* Sağ: Sepete Git */}
            <TouchableOpacity style={styles.goToCartButton} onPress={onGoToCart}>
                <Text style={styles.goToCartText}>Sepete Git ➔</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.background },
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, height: 60, backgroundColor: THEME.white, borderBottomWidth: 1, borderColor: "#E5E7EB" },
  backButton: { padding: 10 },
  backText: { fontSize: 24, color: THEME.primary, fontWeight: "bold" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: THEME.textDark },
  imageContainer: { backgroundColor: THEME.white, height: 300, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  image: { width: "80%", height: "80%" },
  infoCard: { backgroundColor: THEME.white, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, minHeight: 400, marginTop: -20, shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  brand: { fontSize: 14, color: "#6B7280", fontWeight: "600", marginBottom: 4, textTransform: "uppercase" },
  name: { fontSize: 22, fontWeight: "bold", color: THEME.textDark, marginBottom: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  price: { fontSize: 24, fontWeight: "bold", color: THEME.primary },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bgRed: { backgroundColor: "#FEE2E2" },
  stockText: { fontWeight: "700", fontSize: 12 },
  stockTextOutOfStock: { color: THEME.danger },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 16 },
  meta: { fontSize: 14, color: "#6B7280", marginBottom: 8 },
  metaValue: { color: THEME.textDark, fontWeight: "600" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: THEME.textDark, marginTop: 12, marginBottom: 8 },
  description: { fontSize: 14, color: "#4B5563", lineHeight: 22 },
  
  // FOOTER ALANI
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: THEME.white, padding: 16, borderTopWidth: 1, borderColor: "#E5E7EB" },
  
  // Tek Buton (Sepete Ekle)
  addButton: { backgroundColor: THEME.secondary, paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  disabledButton: { backgroundColor: "#E5E7EB" },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: THEME.textDark },

  // Aktif Footer (Counter + Sepete Git)
  activeFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  
  // Counter Kısmı
  counterWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
  counterBtnSmall: { width: 44, height: 44, borderRadius: 10, backgroundColor: THEME.white, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  counterBtnDisabled: { backgroundColor: "#E5E7EB" },
  counterBtnText: { fontSize: 20, fontWeight: 'bold', color: THEME.primary },
  counterValueText: { fontSize: 18, fontWeight: 'bold', color: THEME.textDark, marginHorizontal: 16 },

  // Sepete Git Butonu
  goToCartButton: { flex: 1, backgroundColor: THEME.primary, height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  goToCartText: { color: THEME.white, fontSize: 16, fontWeight: 'bold' }
});
