import { API_BASE_URL } from "../../config/env";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers ?? {});
  const hasJsonBody = options.body && !(options.body instanceof FormData);
  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${normalizedPath}`;

  console.log("[apiFetch] request started", {
    url,
    method: options.method ?? "GET",
  });

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    console.error("[apiFetch] network error", { url, err });
    throw new Error("Network request failed. Check connectivity or DNS resolution.");
  }

  const rawBody = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  const isJsonResponse = contentType.includes("application/json");

  if (!response.ok) {
    const message = safeErrorMessage(rawBody, response.status, isJsonResponse, url);
    console.error("[apiFetch] request failed", {
      status: response.status,
      statusText: response.statusText,
      url,
      contentType,
      message,
      rawBody: isJsonResponse ? undefined : rawBody,
    });
    throw new Error(message);
  }

  if (response.status === 204 || rawBody.trim().length === 0) {
    return null as T;
  }

  if (!isJsonResponse) {
    console.warn("[apiFetch] non-JSON success response", { url, contentType });
    return rawBody as unknown as T;
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch (parseError) {
    console.error("[apiFetch] failed to parse JSON response", { url, parseError });
    console.log("[apiFetch] raw body:", rawBody);
    throw new Error("Failed to parse JSON response from API.");
  }
}

function safeErrorMessage(rawBody: string, status: number, isJson: boolean, url: string): string {
  if (isJson) {
    try {
      const data = JSON.parse(rawBody);
      if (typeof data === "string") return data;
      if (data?.message) return data.message;
      if (data?.error) return data.error;
    } catch (parseError) {
      console.warn("[apiFetch] failed to parse error body as JSON", { url, parseError });
    }
  }

  if (status === 404) {
    return `Resource not found (404) for ${url}. Verify the path matches backend route definitions.`;
  }

  if (!rawBody) {
    return `Request failed with status ${status}`;
  }

  return `Request failed with status ${status}. Body: ${rawBody}`;
}
