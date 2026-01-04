import React from "react";
import { ActivityIndicator, View, Text, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../styles";
import { Address } from "../../types";

// *** DÜZELTME BURADA YAPILDI (safeAddresses.map kullanıldı) ***
export default function AddressScreen({
  addresses,
  selectedId,
  onSelect,
  onBack,
  onContinue,
  onAddAddress,
  onDelete,
  onSetDefault,
  onManageAddresses,
  showManageButton,
  loading,
}: any) {
  // Eğer addresses undefined gelirse boş diziye çevir
  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onBack}><Text style={styles.headerBackText}>←</Text></TouchableOpacity>
        <View style={styles.headerCenterAbsolute}><Text style={styles.headerTitle}>Teslimat Adresi</Text></View>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? <ActivityIndicator style={{ marginBottom: 12 }} /> : null}
        {showManageButton ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={onManageAddresses}>
            <Text style={styles.secondaryButtonText}>Adreslerimi Yönet</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.sectionHeader}>Kayıtlı Adreslerim</Text>
        {!safeAddresses.length && !loading ? <Text style={styles.emptyText}>Kayıtlı adres bulunamadı.</Text> : null}
        
        {/* HATA DÜZELTİLDİ: addresses.map yerine safeAddresses.map kullanıldı */}
        {safeAddresses.map((address: Address) => {
          const isSelected = selectedId === address.id;
          return (
            <TouchableOpacity key={address.id} style={[styles.selectionCard, isSelected && styles.selectionCardActive]} onPress={() => onSelect(address.id)}>
              <View style={styles.selectionHeader}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.radioIcon}>{isSelected ? "◉" : "○"}</Text>
                  <Text style={styles.selectionTitle}>{address.title}</Text>
                  {address.isDefault ? <Text style={styles.defaultBadge}>Varsayılan</Text> : null}
                </View>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity onPress={() => onSetDefault(address)}><Text style={styles.linkText}>Varsayılan Yap</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => onDelete(address.id)}><Text style={styles.deleteText}>Sil</Text></TouchableOpacity>
                </View>
              </View>
              <Text style={styles.selectionDetail}>{address.detail}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.dashedButton} onPress={onAddAddress}><Text style={styles.dashedButtonText}>+ Yeni Adres Ekle</Text></TouchableOpacity>
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}><Text style={styles.primaryButtonText}>Devam Et</Text></TouchableOpacity>
      </View>
    </View>
  );
}
