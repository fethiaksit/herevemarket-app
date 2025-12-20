import { apiConfig } from "../../config/env";

type ApiRequestOptions = RequestInit;

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}) {
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = apiConfig.apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${baseUrl}${normalizedPath}`;

  console.log("[API URL]", apiConfig.apiBaseUrl);
  console.log("[apiFetch] request started", {
    url,
    method: options.method ?? "GET",
  });

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("[apiFetch] network error", err);
    throw err;
  }

  const rawBody = await response.text();

  if (!response.ok) {
    console.error("[apiFetch] request failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      rawBody,
    });
    const message = safeErrorMessage(rawBody, response.status);
    throw new Error(message);
  }

  if (response.status === 204 || rawBody.trim().length === 0) {
    return null as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch (parseError) {
    console.error("[apiFetch] failed to parse JSON response", parseError);
    console.log("[apiFetch] raw body:", rawBody);
    throw parseError;
  }
}

// 🔹 HATA MESAJINI GÜVENLİ OKUMA
function safeErrorMessage(rawBody: string, status: number): string {
  if (!rawBody) {
    return `Request failed with status ${status}`;
  }

  try {
    const data = JSON.parse(rawBody);
    if (typeof data === "string") return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
  } catch (parseError) {
    console.warn("[apiFetch] failed to parse error body", parseError);
  }

  return `Request failed with status ${status}. Body: ${rawBody}`;
}
