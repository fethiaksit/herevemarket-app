import { ProductDto } from "../services/api/products";

export type RootStackParamList = {
  Home: undefined;
  CategoryProducts: {
    categoryId: string;
    categoryName: string;
    products: ProductDto[];
  };
};

export type AuthStackParamList = {
  AuthLanding: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  AddressList: undefined;
};
