import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { styles } from "../styles";

export default function AddAddressScreen({ onSave, onCancel }: any) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [note, setNote] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerBackButton} onPress={onCancel}><Text style={styles.headerBackText}>←</Text></TouchableOpacity>
        <View style={styles.headerCenterAbsolute}><Text style={styles.headerTitle}>Adres Ekle</Text></View>
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
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSave({ title, detail, note })}><Text style={styles.primaryButtonText}>Kaydet</Text></TouchableOpacity>
      </View>
    </View>
  );
}
