import Constants from "expo-constants";

type Stage = "development" | "staging" | "production";

const defaultBaseUrls = {
  development: "http://52.57.82.30",      // replace LAN IP
  staging: "https://staging.api.herevemarket.com",
  production: "https://api.herevemarket.com",
};

const extra = (Constants.expoConfig?.extra ?? {}) as {
  stage?: Stage;
  apiBaseUrls?: Partial<Record<Stage, string>>;
};

const stage: Stage = extra.stage ?? "development";
const baseUrls = { ...defaultBaseUrls, ...(extra.apiBaseUrls ?? {}) };
export const API_BASE_URL = "http://52.57.82.30/api/v1";