import React from "react";
import { View, Text, TouchableOpacity } from "react-native";


type CartItem = {
  id: number;
  quantity: number;
};

type Props = {
  cart: CartItem[];
  products: {
    id: number;
    name: string;
    price: string;
  }[];
  onBack: () => void;
};

export default function CartScreen({ cart, products, onBack }: Props) {
  const getProduct = (id: number) =>
    products.find((p) => p.id === id);

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    if (!product) return sum;

    const price = parseFloat(
      product.price.replace("₺", "").replace(",", ".")
    );

    return sum + price * item.quantity;
  }, 0);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity onPress={onBack}>
        <Text style={{ fontSize: 16 }}>← Geri</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 22, fontWeight: "bold", marginVertical: 16 }}>
        Sepetim
      </Text>

      {cart.length === 0 && <Text>Sepetiniz boş</Text>}

      {cart.map((item) => {
        const product = getProduct(item.id);
        if (!product) return null;

        return (
          <View
            key={item.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Text>{product.name}</Text>
            <Text>
              {item.quantity} x {product.price}
            </Text>
          </View>
        );
      })}

      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 24 }}>
        Toplam: {total.toFixed(2)} ₺
      </Text>
    </View>
  );
}
