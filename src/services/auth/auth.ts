import { apiFetch } from "../api/client";
import { tokenStorage } from "./tokenStorage";
import { ADMIN_JWT } from "../../config/adminToken";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
};

export async function login(credentials: LoginRequest) {
  const response = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${ADMIN_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  await tokenStorage.setAccessToken(response.accessToken);
  return response;
}

export async function logout() {
  await tokenStorage.clear();
}
