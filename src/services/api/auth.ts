import { apiFetch } from "./client";
import { User } from "../../types";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
};

export async function loginUser(payload: LoginRequest) {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerUser(payload: RegisterRequest) {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser(token: string) {
  return apiFetch<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
