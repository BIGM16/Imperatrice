import api from "../lib/axios";
import type { Drink, Category } from "@/types/types";

// ─── Drinks ──────────────────────────────────────────────────────────────────

export async function getDrinks(): Promise<Drink[]> {
  const response = await api.get<Drink[]>("/inventory/drinks/");
  return response.data;
}

export async function getDrink(id: string | number): Promise<Drink> {
  const response = await api.get<Drink>(`/inventory/drinks/${id}/`);
  return response.data;
}

export async function createDrink(data: {
  name: string;
  category?: string | number;
  category_id?: string | number;
  price_purchase: number;
  price_sale: number;
  stock?: number;
  volume?: string;
  image_url?: string;
}): Promise<Drink> {
  const response = await api.post<Drink>("/inventory/drinks/", data);
  return response.data;
}

export async function updateDrink(
  id: string | number,
  data: Partial<{
    name: string;
    category: string | number;
    category_id: string | number;
    price_purchase: number;
    price_sale: number;
    stock: number;
    volume: string;
    image_url: string;
  }>
): Promise<Drink> {
  const response = await api.patch<Drink>(`/inventory/drinks/${id}/`, data);
  return response.data;
}

export async function deleteDrink(id: string | number): Promise<void> {
  await api.delete(`/inventory/drinks/${id}/`);
}

// ─── Stock ───────────────────────────────────────────────────────────────────

export async function updateDrinkStock(
  drinkId: string | number,
  quantity: number,
  action: "add" | "remove" | "set"
): Promise<{ success: boolean; new_stock: number }> {
  const response = await api.post<{ success: boolean; new_stock: number }>(
    `/inventory/drinks/${drinkId}/update_stock/`,
    { quantity, action }
  );
  return response.data;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/inventory/categories/");
  return Array.isArray(response.data) ? response.data : [];
}


// ─── Low Stock ───────────────────────────────────────────────────────────────

export async function getLowStockDrinks(threshold = 10): Promise<Drink[]> {
  const response = await api.get<Drink[]>(
    `/inventory/drinks/?stock__lte=${threshold}`
  );
  return response.data;
}
