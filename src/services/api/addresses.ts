import { apiFetch } from "./client";
import { Address } from "../../types";

export type AddressPayload = Omit<Address, "id">;

export async function getAddresses(token: string) {
  return apiFetch<Address[]>("/user/addresses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createAddress(token: string, payload: AddressPayload) {
  return apiFetch<Address>("/user/addresses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(token: string, id: string, payload: AddressPayload) {
  return apiFetch<Address>(`/user/addresses/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(token: string, id: string) {
  return apiFetch<void>(`/user/addresses/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
