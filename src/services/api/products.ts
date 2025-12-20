import { apiFetch } from "./client";

type RawProduct = {
  id?: string;
  name?: string;
  price?: number | string;
  image?: string;
  imageUrl?: string;
  category?: string | string[];
  isCampaign?: boolean;
  isDiscounted?: boolean;
  _id?: string;
  clientId?: string | number;
};

export type ProductDto = {
  id: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  category: string[];
  isCampaign?: boolean;
  isDiscounted?: boolean;
};

type ProductsResponse =
  | RawProduct[]
  | { data?: RawProduct[]; pagination?: unknown }
  | { data?: { data?: RawProduct[]; pagination?: unknown } };

export async function getProducts() {
  console.log("[getProducts] request started");
  console.log("[getProducts] public request, no token");
  const response = await apiFetch<ProductsResponse>("/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log("[getProducts] response:", response);

  const rawData = Array.isArray(response)
    ? response
    : Array.isArray((response as { data?: RawProduct[] })?.data)
    ? ((response as { data?: RawProduct[] }).data ?? [])
    : Array.isArray((response as { data?: { data?: RawProduct[] } })?.data?.data)
    ? ((response as { data?: { data?: RawProduct[] } }).data?.data ?? [])
    : [];

  // console.log("[getProducts] API raw data", response);
  const mapped = rawData
    .map((item) => ({
      id: String(item.id ?? item._id ?? item.clientId ?? ""),
      name: item.name ?? "Adsız Ürün",
      price: Number(item.price) || 0,
      image: item.image ?? item.imageUrl,
      category: Array.isArray(item.category)
        ? item.category
        : item.category
        ? [item.category]
        : [],
      isCampaign: Boolean(item.isCampaign),
      isDiscounted: Boolean(item.isDiscounted),
    }))
    .filter((item) => item.id);

  // console.log("[getProducts] mapped products", mapped);
  return mapped;
}
