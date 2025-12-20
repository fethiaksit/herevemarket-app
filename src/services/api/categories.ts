import { apiFetch } from "./client";

export type CategoryDto = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export async function getCategories() {
  console.log("[getCategories] public request, no token");
  const response = await apiFetch<{ data: CategoryDto[] }>("/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
