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
