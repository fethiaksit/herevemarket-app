import { Product } from "./types";

export const categories = [
  { id: "promo", name: "Kampanyalı Ürünler" },
  { id: "meyve", name: "Meyve" },
  { id: "sebze", name: "Sebze" },
  { id: "icecek", name: "İçecek" },
  { id: "atistirmalik", name: "Atıştırmalık" }
];

export const products: Product[] = baseProducts.map((product) => ({
  ...product,
  isCampaign: product.isCampaign ?? product.categoryId === "promo",
  stock: product.stock ?? 10,
  inStock: product.inStock ?? true,
}));

const baseProducts: Array<Omit<Product, "stock" | "inStock"> & Partial<Pick<Product, "stock" | "inStock">>> = [
  {
    id: "p1",
    name: "İndirimli Elma",
    price: 19.5,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p2",
    name: "Kampanyalı Çikolata",
    price: 22,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p17",
    name: "İndirimli Peynir",
    price: 42,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p18",
    name: "Kampanyalı Kahve",
    price: 55,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p7",
    name: "Süper Fiyatlı Ayran",
    price: 9.9,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p8",
    name: "Fırsat Paketli Su",
    price: 12.5,
    image: "https://via.placeholder.com/120",
    categoryId: "promo"
  },
  {
    id: "p3",
    name: "Elma",
    price: 25,
    image: "https://via.placeholder.com/120",
    categoryId: "meyve"
  },
  {
    id: "p9",
    name: "Muz",
    price: 32,
    image: "https://via.placeholder.com/120",
    categoryId: "meyve"
  },
  {
    id: "p10",
    name: "Çilek",
    price: 45,
    image: "https://via.placeholder.com/120",
    categoryId: "meyve"
  },
  {
    id: "p19",
    name: "Avokado",
    price: 52,
    image: "https://via.placeholder.com/120",
    categoryId: "meyve"
  },
  {
    id: "p20",
    name: "Yeşil Elma",
    price: 27,
    image: "https://via.placeholder.com/120",
    categoryId: "meyve"
  },
  {
    id: "p4",
    name: "Domates",
    price: 18,
    image: "https://via.placeholder.com/120",
    categoryId: "sebze"
  },
  {
    id: "p11",
    name: "Salatalık",
    price: 15,
    image: "https://via.placeholder.com/120",
    categoryId: "sebze"
  },
  {
    id: "p12",
    name: "Patates",
    price: 20,
    image: "https://via.placeholder.com/120",
    categoryId: "sebze"
  },
  {
    id: "p21",
    name: "Soğan",
    price: 13,
    image: "https://via.placeholder.com/120",
    categoryId: "sebze"
  },
  {
    id: "p22",
    name: "Sarımsak",
    price: 16,
    image: "https://via.placeholder.com/120",
    categoryId: "sebze"
  },
  {
    id: "p5",
    name: "Kola",
    price: 35,
    image: "https://via.placeholder.com/120",
    categoryId: "icecek"
  },
  {
    id: "p13",
    name: "Soğuk Çay",
    price: 28,
    image: "https://via.placeholder.com/120",
    categoryId: "icecek"
  },
  {
    id: "p14",
    name: "Soda",
    price: 14,
    image: "https://via.placeholder.com/120",
    categoryId: "icecek"
  },
  {
    id: "p23",
    name: "Gazoz",
    price: 17,
    image: "https://via.placeholder.com/120",
    categoryId: "icecek"
  },
  {
    id: "p24",
    name: "Meyve Suyu",
    price: 21,
    image: "https://via.placeholder.com/120",
    categoryId: "icecek"
  },
  {
    id: "p6",
    name: "Cips",
    price: 40,
    image: "https://via.placeholder.com/120",
    categoryId: "atistirmalik"
  },
  {
    id: "p15",
    name: "Kavrulmuş Fıstık",
    price: 48,
    image: "https://via.placeholder.com/120",
    categoryId: "atistirmalik"
  },
  {
    id: "p16",
    name: "Karamel Popcorn",
    price: 38,
    image: "https://via.placeholder.com/120",
    categoryId: "atistirmalik"
  },
  {
    id: "p25",
    name: "Kuruyemiş Karışık",
    price: 46,
    image: "https://via.placeholder.com/120",
    categoryId: "atistirmalik"
  },
  {
    id: "p26",
    name: "Bisküvi Paketi",
    price: 24,
    image: "https://via.placeholder.com/120",
    categoryId: "atistirmalik"
  }
];
