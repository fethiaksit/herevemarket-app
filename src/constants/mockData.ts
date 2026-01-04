import { CategoryDto } from "../services/api/categories";
import { Address } from "../types";
import { Brand, PaymentMethod, Product } from "../types/home";

export const CART_FOOTER_HEIGHT = 180;
export const CAMPAIGN_CATEGORY_ID = "campaign";
export const CAMPAIGN_CATEGORY_NAME = "Fırsatlar";

export const markalar: Brand[] = [
  { name: "Eti", image: require("../../assets/eti.png") },
  { name: "Ülker", image: require("../../assets/ulker.png") },
  { name: "Torku", image: require("../../assets/torku.png") },
  { name: "Axe", image: require("../../assets/cola.png") },
  { name: "Clear", image: require("../../assets/axe.png") },
  { name: "Domestos", image: require("../../assets/Domestos.png") },
  { name: "Dove", image: require("../../assets/Dove.png") },
  { name: "OMO", image: require("../../assets/OMO.png") },
  { name: "Signal", image: require("../../assets/signal.png") },
  { name: "Knorr", image: require("../../assets/knoor.png") },
];

export const placeholderImage = require("../../assets/logo.png");
export const dailyDeals = [
  require("../../assets/banner1.png"),
  require("../../assets/banner2.png"),
  require("../../assets/banner3.png"),
];

export const fallbackProducts: Product[] = [
  {
    id: "sample-su",
    name: "Doğal Kaynak Suyu 5L",
    price: 45.90,
    brand: "Hayat",
    barcode: "8690000000000",
    stock: 12,
    inStock: true,
    image: "https://cdn.example.com/ayran.png",
    imageUrl: "https://cdn.example.com/ayran.png",
    category: ["İçecek", "Temel Gıda"],
    isCampaign: true,
  },
];

export const fallbackCategories: CategoryDto[] = [
  { id: "İçecek", name: "İçecek", isActive: true, createdAt: "" },
  { id: "Temel Gıda", name: "Temel Gıda", isActive: true, createdAt: "" },
];

export const ensureCampaignCategory = (list: CategoryDto[]): CategoryDto[] => {
  const filtered = list.filter(
    (category) =>
      category.id !== CAMPAIGN_CATEGORY_ID &&
      category.name !== CAMPAIGN_CATEGORY_NAME
  );
  return [
    {
      id: CAMPAIGN_CATEGORY_ID,
      name: CAMPAIGN_CATEGORY_NAME,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    ...filtered,
  ];
};

export const initialAddresses: Address[] = [];
export const initialPaymentMethods: PaymentMethod[] = [
  { id: "card", label: "Kredi Kartı", description: "Visa - **** 4242" },
];
