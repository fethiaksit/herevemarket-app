import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";

type Props = { visible: boolean; onClose: () => void };

export const LoginModal: React.FC<Props> = ({ visible, onClose }) => {
  const [phone, setPhone] = useState("");

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          placeholder="Telefon numarası"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.loginBtn} onPress={onClose}>
          <Text style={{ color: "#082A5F", fontWeight: "700" }}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "800", color: "#082A5F", marginBottom: 12, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginBottom: 12 },
  loginBtn: { padding: 12, backgroundColor: "#FFD300", borderRadius: 8, alignItems: "center" },
});
