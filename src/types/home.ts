import { ImageSourcePropType } from "react-native";
import { ProductDto } from "../services/api/products";

export type Brand = { name: string; image: ImageSourcePropType };
export type Product = ProductDto & { categoryIds?: string[] };
export type PaymentMethod = { id: string; label: string; description: string };
export type OrderItemPayload = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Screen =
  | "home"
  | "category"
  | "cart"
  | "address"
  | "addAddress"
  | "payment"
  | "addCard"
  | "summary"
  | "success"
  | "productDetail";

export type CartLineItem = { product: Product; quantity: number };

export type LegalUrlKey = "about" | "ssl" | "returns" | "privacy" | "distance";
