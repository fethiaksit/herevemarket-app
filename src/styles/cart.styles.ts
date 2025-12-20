import { StyleSheet } from "react-native";

export const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  cartItemImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#F3F3F3",
  },
  header: {
    backgroundColor: "#FFD700",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 120,
    height: 40,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  back: {
    fontSize: 22,
    color: "#000080",
    fontWeight: "bold",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000080",
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  price: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#000080",
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000080",
    marginBottom: 12,
  },

  checkout: {
    backgroundColor: "#000080",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  checkoutText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
});