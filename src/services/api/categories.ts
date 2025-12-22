import { apiFetch } from "./client";

export type CategoryDto = {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type CategoriesResponse =
  | CategoryDto[]
  | { data?: CategoryDto[] }
  | { data?: { data?: CategoryDto[] } };

export async function getCategories() {
 
  const response = await apiFetch<CategoriesResponse>("/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray((response as { data?: CategoryDto[] })?.data)) {
    return (response as { data?: CategoryDto[] }).data ?? [];
  }

  if (Array.isArray((response as { data?: { data?: CategoryDto[] } })?.data?.data)) {
    return (response as { data?: { data?: CategoryDto[] } }).data?.data ?? [];
  }

  return [];
}
