import { apiFetch } from "./client";

export type CategoryDto = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

export async function getCategories() {
  const response = await apiFetch<{ data: CategoryDto[] }>("/admin/categories");

  return response.data;
}
