import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "herevemarket_access_token";

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async setAccessToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};
