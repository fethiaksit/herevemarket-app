import Constants from "expo-constants";

type Stage = "development" | "staging" | "production";

type ApiBaseUrls = Partial<Record<Stage, string>>;

type EnvConfig = {
  stage: Stage;
  apiBaseUrl: string;
};

type ExtraConfig = {
  stage?: Stage;
  apiBaseUrls?: ApiBaseUrls;
};

const defaultBaseUrls: ApiBaseUrls = {
  development: "http://localhost:8080",
  staging: "https://staging.api.herevemarket.com",
  production: "https://api.herevemarket.com",
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

const stage: Stage = extra.stage ?? "development";
const baseUrls = { ...defaultBaseUrls, ...(extra.apiBaseUrls ?? {}) };
const apiBaseUrl = baseUrls[stage];

if (!apiBaseUrl) {
  throw new Error(`Missing API base URL for stage: ${stage}`);
}

export const apiConfig: EnvConfig = {
  stage,
  apiBaseUrl,
};
