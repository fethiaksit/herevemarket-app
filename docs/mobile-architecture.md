# Mobile-first API Architecture

This proposal hardens the Expo (React Native) client and the REST backend so that products are fetched securely without leaking admin-only access.

## Folder structure (frontend)
```
src/
  config/
    env.ts                 # Environment-aware API base URL
  services/
    api/
      client.ts            # Fetch wrapper that injects tokens and validates base URL
      products.ts          # Public product API
    auth/
      auth.ts              # Login/logout flows
      tokenStorage.ts      # Secure token persistence
  screen/
    HomePage.tsx           # Uses services layer to render products
```

## Environment-based API configuration
Use `app.json` `extra` entries to declare per-environment URLs. The client rejects `localhost` so that devices/emulators always hit a reachable host.

```jsonc
// app.json
{
  "expo": {
    "extra": {
      "stage": "development", // or staging/production
      "apiBaseUrls": {
        "development": "https://dev.api.herevemarket.com",
        "staging": "https://staging.api.herevemarket.com",
        "production": "https://api.herevemarket.com"
      }
    }
  }
}
```

The config loader resolves the correct URL and prevents unsafe localhost usage.

```ts
// src/config/env.ts
const defaultBaseUrls = {
  development: "https://dev.api.herevemarket.com",
  staging: "https://staging.api.herevemarket.com",
  production: "https://api.herevemarket.com",
};

if (/localhost|127\.0\.0\.1/.test(apiBaseUrl)) {
  throw new Error("API base URL cannot use localhost. Use LAN IP or emulator bridge instead.");
}
```

## API layer and token handling (frontend)
Centralized fetch wrapper injects tokens from secure storage and keeps endpoints environment-aware. Product calls are unauthenticated and avoid admin routes.

```ts
// src/services/api/client.ts
export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}) {
  const { auth = true, ...rest } = options;
  const headers = new Headers(rest.headers ?? {});
  if (auth) {
    const token = await tokenStorage.getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  const url = path.startsWith("http") ? path : `${apiConfig.apiBaseUrl}${path}`;
  const response = await fetch(url, { ...rest, headers });
  if (!response.ok) throw new Error(await safeErrorMessage(response));
  return response.status === 204 ? null : ((await response.json()) as T);
}
```

Tokens are stored in `expo-secure-store` after login, not hardcoded.

```ts
// src/services/auth/auth.ts
export async function login(credentials: LoginRequest) {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  await tokenStorage.setAccessToken(response.accessToken);
  return response;
}
```

Public product retrieval stays out of admin paths.

```ts
// src/services/api/products.ts
export async function getProducts() {
  return apiFetch<ProductDto[]>("/api/v1/products", { auth: false });
}
```

## Secure backend API contract (for Spring Boot or Node.js)
- **Authentication**: `POST /auth/login` returns `{ accessToken, refreshToken?, expiresIn? }` after validating credentials. Access tokens carry user role claims.
- **Public product catalog**: `GET /api/v1/products` is read-only and available to authenticated or anonymous users (rate-limited). Response shape:
  ```json
  [
    { "id": 123, "name": "Su 1L", "price": 15.9, "image": "https://cdn..." }
  ]
  ```
- **Cart/order**: Authenticated routes such as `POST /api/v1/cart` and `POST /api/v1/orders` require `Authorization: Bearer <token>`.
- **Admin isolation**: Admin-only CRUD endpoints (e.g., `/admin/products`) stay behind a separate admin panel or server-to-server channel and are not reachable from the mobile client.
- **Environment separation**: Deploy dev/staging/prod backends with distinct hostnames and keys. Tokens are scoped per environment.

## Connecting to a local backend during development
- Run the backend on your machine and expose it over LAN: `http://<your-ip>:8080`.
- Emulators use platform bridges instead of `localhost`:
  - Android emulator: `http://10.0.2.2:8080`
  - Android on Genymotion: `http://10.0.3.2:8080`
  - iOS simulator: `http://127.0.0.1:8080` is allowed by simulator networking, but still set via `app.json` so devices use the same config.
- Update `app.json` `extra.apiBaseUrls.development` to the LAN/bridge URL before running `expo start`. Never hardcode URLs inside components.

## Example: fetching products in the UI
`HomePage` now pulls products from the public catalog service and renders loading/error/empty states.

```ts
useEffect(() => {
  const loadProducts = async () => {
    try {
      const items = await getProducts();
      setProducts(items);
    } catch {
      setError("Ürünler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };
  loadProducts();
}, []);
```

## Common mistakes and why they are wrong
- **Using `localhost`**: Physical devices cannot resolve your laptop's loopback interface; calls fail silently. Always use a LAN IP or emulator bridge.
- **Hardcoded tokens**: Tokens expire and expose admin access. Always obtain them via login and store securely.
- **Calling admin endpoints from mobile**: Risks privilege escalation and complicates backend authorization. Keep mobile clients on public/user-scoped routes only.
- **Mixing environments**: Pointing a dev app at production APIs can pollute data and leak secrets. Use explicit stage-based URLs and keys.
