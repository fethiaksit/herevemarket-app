import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { MainStackParamList } from "../navigation/types";
import { Address } from "../types";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../services/api/addresses";

export type AddressListProps = NativeStackScreenProps<MainStackParamList, "AddressList">;

const emptyForm = { title: "", detail: "", note: "", isDefault: false };

export default function AddressListScreen({ navigation }: AddressListProps) {
  const { token, logout } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadAddresses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getAddresses(token);
      setAddresses(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Adresler alınamadı.";
      Alert.alert("Hata", message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleSubmit = async () => {
    if (!token) return;
    if (!form.title.trim() || !form.detail.trim()) {
      Alert.alert("Eksik bilgi", "Adres başlığı ve detayı gerekli.");
      return;
    }
    setLoading(true);
    try {
      if (editing) {
        const updated = await updateAddress(token, editing.id, form);
        setAddresses((prev) => prev.map((addr) => (addr.id === editing.id ? updated : addr)));
      } else {
        const created = await createAddress(token, form);
        setAddresses((prev) => [...prev, created]);
      }
      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Adres kaydedilemedi.";
      Alert.alert("Hata", message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (address: Address) => {
    if (!token) return;
    Alert.alert("Adresi Sil", "Bu adresi silmek istiyor musunuz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteAddress(token, address.id);
            setAddresses((prev) => prev.filter((item) => item.id !== address.id));
          } catch (error) {
            const message = error instanceof Error ? error.message : "Adres silinemedi.";
            Alert.alert("Hata", message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const handleDefault = async (address: Address) => {
    if (!token) return;
    setLoading(true);
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
    } catch (error) {
      const message = error instanceof Error ? error.message : "Varsayılan adres ayarlanamadı.";
      Alert.alert("Hata", message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditing(address);
    setForm({
      title: address.title,
      detail: address.detail,
      note: address.note ?? "",
      isDefault: Boolean(address.isDefault),
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adreslerim</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
      {loading ? <ActivityIndicator style={styles.spinner} /> : null}
      <ScrollView contentContainerStyle={styles.content}>
        {addresses.length === 0 && !loading ? (
          <Text style={styles.emptyText}>Henüz kayıtlı adresiniz yok.</Text>
        ) : null}
        {addresses.map((address) => (
          <View key={address.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{address.title}</Text>
              {address.isDefault ? <Text style={styles.defaultBadge}>Varsayılan</Text> : null}
            </View>
            <Text style={styles.cardDetail}>{address.detail}</Text>
            {address.note ? <Text style={styles.cardNote}>Not: {address.note}</Text> : null}
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleEdit(address)}>
                <Text style={styles.actionText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDefault(address)}>
                <Text style={styles.actionText}>Varsayılan Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(address)}>
                <Text style={styles.deleteText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editing ? "Adresi Güncelle" : "Yeni Adres"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Adres Başlığı"
            value={form.title}
            onChangeText={(value) => setForm((prev) => ({ ...prev, title: value }))}
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Adres Detayı"
            multiline
            value={form.detail}
            onChangeText={(value) => setForm((prev) => ({ ...prev, detail: value }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Not (Opsiyonel)"
            value={form.note}
            onChangeText={(value) => setForm((prev) => ({ ...prev, note: value }))}
          />
          <View style={styles.formActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.primaryButtonText}>Kaydet</Text>
            </TouchableOpacity>
            {editing ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setEditing(null);
                  setForm(emptyForm);
                }}
              >
                <Text style={styles.secondaryButtonText}>İptal</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  header: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  backText: { fontSize: 22, color: "#004AAD" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  logoutText: { color: "#EF4444", fontWeight: "600" },
  spinner: { marginTop: 16 },
  content: { padding: 16, paddingBottom: 32 },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  defaultBadge: {
    color: "#10B981",
    fontWeight: "600",
  },
  cardDetail: { color: "#4B5563", marginBottom: 4 },
  cardNote: { color: "#9CA3AF" },
  cardActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionText: { color: "#004AAD", fontWeight: "600" },
  deleteText: { color: "#EF4444", fontWeight: "600" },
  formCard: {
    marginTop: 8,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  formTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  multiline: { height: 80, textAlignVertical: "top" },
  formActions: { flexDirection: "row", gap: 12 },
  primaryButton: {
    flex: 1,
    backgroundColor: "#004AAD",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#004AAD",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: "#004AAD", fontWeight: "600" },
});
