import { apiFetch } from "./client";
import { OrderPayload } from "../../types";

export async function submitOrder(payload: OrderPayload, token?: string | null) {
  return apiFetch<{ id: string }>("/orders", {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: JSON.stringify(payload),
  });
}
