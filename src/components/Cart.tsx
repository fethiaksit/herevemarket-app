import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from "react-native";
import { CartItem } from "../types";

type Props = {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
};

export const Cart: React.FC<Props> = ({ visible, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Sepet</Text>

        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price.toFixed(2)} ₺ x {item.quantity}</Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                  <Text style={styles.action}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  <Text style={styles.action}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemove(item.id)}>
                  <Text style={[styles.action, { color: "red" }]}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.footer}>
          <Text style={styles.total}>Toplam: {total.toFixed(2)} ₺</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: "#f7f7fb" },
  title: { fontSize: 22, fontWeight: "800", color: "#082A5F", marginBottom: 12 },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: { fontWeight: "700", color: "#082A5F" },
  itemPrice: { color: "#666", marginTop: 6 },
  itemActions: { flexDirection: "row", gap: 10, alignItems: "center" },
  action: { fontSize: 16, paddingHorizontal: 8 },
  footer: { marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  total: { fontSize: 18, fontWeight: "800", color: "#082A5F" },
  closeBtn: { backgroundColor: "#FFD300", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
});
