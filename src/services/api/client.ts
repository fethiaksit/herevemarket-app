import { apiConfig } from "../../config/env";
import { ADMIN_JWT } from "../../config/adminToken";

type ApiRequestOptions = RequestInit;

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}) {
  const headers = new Headers(options.headers ?? {});

  headers.set("Authorization", `Bearer ${ADMIN_JWT}`);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = apiConfig.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${baseUrl}${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

// 🔹 HATA MESAJINI GÜVENLİ OKUMA
async function safeErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  } catch {
    // ignore
  }
  return `Request failed with status ${response.status}`;
}
