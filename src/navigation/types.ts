import { ProductDto } from "../services/api/products";

export type RootStackParamList = {
  Home: undefined;
  CategoryProducts: {
    categoryId: string;
    categoryName: string;
    products: ProductDto[];
  };
};
