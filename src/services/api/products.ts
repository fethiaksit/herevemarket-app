import { apiFetch } from "./client";


type RawProduct = {
  id?: string;
  name?: string;
  price?: number | string;
  brand?: string;
  barcode?: string;
  stock?: number | string;
  inStock?: boolean;
  image?: string;
  imageUrl?: string;
  category?: string | string[];
  description?: string;
  isCampaign?: boolean;
  isDiscounted?: boolean;
  _id?: string;
  clientId?: string | number;
};
export type ProductInput = {
  name: string;
  price: number;
  brand?: string;
  barcode?: string;
  stock?: number;
  inStock?: boolean;
  image?: string;
  category?: string[];
  description?: string;
  isCampaign?: boolean;
  isDiscounted?: boolean;
};
export type ProductDto = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  barcode?: string;
  stock: number;
  inStock: boolean;
  image?: string;
  imageUrl?: string;
  category: string[];
  description?: string;
  isCampaign?: boolean;
  isDiscounted?: boolean;
};

type ProductsResponse =
  | RawProduct[]
  | { data?: RawProduct[]; pagination?: unknown }
  | { data?: { data?: RawProduct[]; pagination?: unknown } };


  export async function fetchProducts() {
    return apiFetch("/products"); // resolves to https://api.herevemarket.com/products when API_BASE_URL is set
  }

  export async function createProduct(payload: ProductInput) {
    return apiFetch("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
export async function getProducts() {
  console.log("[getProducts] request started");
  console.log("[getProducts] public request, no token");
  const response = await apiFetch<ProductsResponse>("/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  const rawData = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: RawProduct[] })?.data)
    ? ((response as { data?: RawProduct[] }).data ?? [])
    : Array.isArray((response as { data?: { data?: RawProduct[] } })?.data?.data)
    ? ((response as { data?: { data?: RawProduct[] } }).data?.data ?? [])
    : [];

  // console.log("[getProducts] API raw data", response);
  const mapped = rawData
    .map((item) => {
      const stock = Number(item.stock ?? 0);
      const inStock =
        typeof item.inStock === "boolean" ? item.inStock : stock > 0;

      return {
        id: String(item.id ?? item._id ?? item.clientId ?? ""),
        name: item.name ?? "Adsız Ürün",
        price: Number(item.price) || 0,
        brand: item.brand,
        barcode: item.barcode,
        stock,
        inStock,
        image: item.image ?? item.imageUrl,
        description: item.description,
        category: Array.isArray(item.category)
          ? item.category
          : item.category
          ? [item.category]
          : [],
        isCampaign: Boolean(item.isCampaign),
        isDiscounted: Boolean(item.isDiscounted),
      };
    })
    .filter((item) => item.id);

  // console.log("[getProducts] mapped products", mapped);
  return mapped;
}
