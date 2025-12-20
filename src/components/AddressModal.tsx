import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
};

export const AddressModal: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const addresses = ["Ev", "İş", "Yazlık"];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Adres Seç</Text>
        {addresses.map((a) => (
          <TouchableOpacity
            key={a}
            onPress={() => {
              onSelect(a);
              onClose();
            }}
            style={styles.item}
          >
            <Text style={{ color: "#082A5F", fontWeight: "700" }}>{a}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={onClose} style={[styles.item, { backgroundColor: "#f1f1f1" }]}>
          <Text>Kapat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "800", color: "#082A5F", marginBottom: 12 },
  item: { padding: 12, borderRadius: 10, backgroundColor: "#fff", marginBottom: 8, borderWidth: 1, borderColor: "#eee" },
});
