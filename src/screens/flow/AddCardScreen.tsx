import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { styles } from "../styles";

export default function AddCardScreen({ onSave, onCancel }: any) {
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onCancel}><Text style={styles.headerBackText}>←</Text></TouchableOpacity>
        <View style={styles.headerCenterAbsolute}><Text style={styles.headerTitle}>Kart Ekle</Text></View>
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
            <Image source={require("../../../assets/visa.png")} style={styles.paymentLogo} resizeMode="contain" />
            <Image source={require("../../../assets/mastercard.png")} style={styles.paymentLogo} resizeMode="contain" />
        </View>
      </ScrollView>
      <View style={styles.footerSimple}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSave({ holder, number, expiry, cvv })}><Text style={styles.primaryButtonText}>Kartı Kaydet</Text></TouchableOpacity>
      </View>
    </View>
  );
}
