import Constants from "expo-constants";

type Stage = "development" | "staging" | "production";

const defaultBaseUrls = {
  development: "https://api.herevemarket.com/",      // replace LAN IP
  staging: "https://staging.api.herevemarket.com",
  production: "https://api.herevemarket.com",
};

const extra = (Constants.expoConfig?.extra ?? {}) as {
  stage?: Stage;
  apiBaseUrls?: Partial<Record<Stage, string>>;
};

const stage: Stage = extra.stage ?? "development";
const baseUrls = { ...defaultBaseUrls, ...(extra.apiBaseUrls ?? {}) };
export const API_BASE_URL = "https://api.herevemarket.com";
