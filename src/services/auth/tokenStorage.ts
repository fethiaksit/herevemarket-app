import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "herevemarket_access_token";

export const tokenStorage = {
  async getAccessToken() {
    return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async setAccessToken(token: string) {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  async clear() {
    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
