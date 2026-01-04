import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { CART_FOOTER_HEIGHT, placeholderImage } from "../../constants/mockData";
import { styles } from "../styles";
import { formatPrice } from "../../utils/cartPrice";
import { CartLineItem, Product } from "../../types/home";
import { THEME } from "../../constants/theme";

export default function CartScreen({
  cartDetails,
  total,
  onBack,
  onCheckout,
  onIncrease,
  onDecrease,
  isOutOfStock,
}: {
  cartDetails: CartLineItem[];
  total: number;
  onBack: () => void;
  onCheckout: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  isOutOfStock: (product: Product) => boolean;
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
                      style={[
                        styles.qtyBtnSmall,
                        isOutOfStock(item.product) && styles.qtyBtnSmallDisabled,
                      ]}
                      onPress={() => onIncrease(item.product.id)}
                      disabled={isOutOfStock(item.product)}
                    >
                      <Text
                        style={[
                          styles.qtyBtnTextSmall,
                          isOutOfStock(item.product) && styles.qtyBtnTextSmallDisabled,
                        ]}
                      >
                        +
                      </Text>
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
