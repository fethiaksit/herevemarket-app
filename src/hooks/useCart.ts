import { useState } from "react";

export type CartItem = {
  id: string;
  quantity: number;
};

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const increase = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const getQuantity = (id: string) =>
    cart.find((i) => i.id === id)?.quantity ?? 0;

  const clearCart = () => setCart([]);

  return { cart, increase, decrease, getQuantity, clearCart };
}
