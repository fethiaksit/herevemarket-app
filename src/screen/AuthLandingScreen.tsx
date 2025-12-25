import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { AuthStackParamList } from "../navigation/types";

export type AuthLandingProps = NativeStackScreenProps<AuthStackParamList, "AuthLanding">;

export default function AuthLandingScreen({ navigation }: AuthLandingProps) {
  const { continueAsGuest, loading } = useAuth();

  const handleGuest = async () => {
    await continueAsGuest();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hereve Market</Text>
        <Text style={styles.subtitle}>Hemen giriş yapın veya üye olmadan devam edin.</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.primaryButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryButtonText}>Üye Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={handleGuest}>
          <Text style={styles.ghostButtonText}>Üye Olmadan Devam Et</Text>
        </TouchableOpacity>

        {loading ? <ActivityIndicator style={styles.spinner} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#004AAD",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#004AAD",
    fontWeight: "600",
  },
  ghostButton: {
    paddingVertical: 12,
  },
  ghostButtonText: {
    color: "#6B7280",
  },
  spinner: {
    marginTop: 16,
  },
});
