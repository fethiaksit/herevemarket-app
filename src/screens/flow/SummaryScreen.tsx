import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { formatPrice } from "../../utils/cartPrice";
import { CartLineItem } from "../../types/home";

export default function SummaryScreen({ cartDetails, total, address, payment, onBack, onSubmit, onPressLegal }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}><Text style={styles.headerBackText}>←</Text></TouchableOpacity>
        <View style={styles.headerCenterAbsolute}><Text style={styles.headerTitle}>Sipariş Özeti</Text></View>
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
        <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}><Text style={styles.primaryButtonText}>Siparişi Onayla</Text></TouchableOpacity>
      </View>
    </View>
  );
}
