import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ShoppingCart } from "lucide-react-native";

type Props = {
  cartCount: number;
  onCartPress: () => void;
  onAddressPress: () => void;
  onHomePress?: () => void;
};

export const Header: React.FC<Props> = ({ cartCount, onCartPress, onAddressPress, onHomePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.logo}>herevemarket</Text>
        {onHomePress ? (
          <TouchableOpacity onPress={onHomePress} style={styles.homeBtn}>
            <Text style={styles.homeText}>Anasayfa</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onAddressPress} style={styles.addressBtn}>
          <Text style={styles.addressText}>Adres</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCartPress} style={styles.iconBtn}>
          <ShoppingCart color="#082A5F" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  homeBtn: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#082A5F",
  },
  homeText: {
    color: "#FFD300",
    fontWeight: "700",
  },
  logo: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFD300", // sarı
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressBtn: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#082A5F",
  },
  addressText: {
    color: "#082A5F",
    fontWeight: "600",
  },
  iconBtn: {
    padding: 6,
  },
  badge: {
    position: "absolute",
    right: 0,
    top: -6,
    backgroundColor: "#FFD300",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#082A5F", fontWeight: "700", fontSize: 12 },
});
