import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { styles } from "../styles";

export default function GuestAddressScreen({ address, onChange, onBack, onContinue }: any) {
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
        <Text style={styles.sectionHeader}>Adres Gir</Text>
        <Text style={styles.inputLabel}>Adres Başlığı</Text>
        <TextInput
          style={styles.input}
          placeholder="Örn: Evim"
          value={address.title}
          onChangeText={(value) => onChange({ ...address, title: value })}
        />
        <Text style={styles.inputLabel}>Adres Detayı</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          placeholder="Mahalle, Cadde, Sokak..."
          value={address.detail}
          onChangeText={(value) => onChange({ ...address, detail: value })}
        />
        <Text style={styles.inputLabel}>Not (Opsiyonel)</Text>
        <TextInput
          style={styles.input}
          placeholder="Zile basmayınız vb."
          value={address.note}
          onChangeText={(value) => onChange({ ...address, note: value })}
        />
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
