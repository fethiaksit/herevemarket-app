export type Category = {
  id: string;
  name: string;
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  barcode?: string;
  stock: number;
  inStock: boolean;
  isCampaign?: boolean;
  categoryId?: string;
  image?: string;
  description?: string;
  category?: string;
};

export type CartItem = Product & { quantity: number };

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Address = {
  id: string;
  title: string;
  detail: string;
  note?: string;
  isDefault?: boolean;
};

export type OrderItemPayload = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderPayload = {
  items: OrderItemPayload[];
  totalPrice: number;
  customer: { title: string; detail: string; note?: string };
  paymentMethod: { id: string; label?: string };
  createdAt: string;
};
