import api from "../lib/axios";
import type { Drink, Category } from "@/types/inventory";

// ─── Drinks ──────────────────────────────────────────────────────────────────
class InventoryService {
  async getDrinks(): Promise<Drink[]> {
    const response = await api.get<Drink[]>("/inventory/drinks/");
    return response.data;
  }

  async getDrink(id: string | number): Promise<Drink> {
    const response = await api.get<Drink>(`/inventory/drinks/${id}/`);
    return response.data;
  }

  async createDrink(data: any): Promise<Drink> {
    const response = await api.post<Drink>("/inventory/drinks/", data);
    return response.data;
  }

  async updateDrink(id: string | number, data: any): Promise<Drink> {
    const response = await api.patch<Drink>(`/inventory/drinks/${id}/`, data);
    return response.data;
  }

  async deleteDrink(id: string | number): Promise<void> {
    await api.delete(`/inventory/drinks/${id}/`);
  }

  async updateDrinkStock(
    drinkId: string | number,
    quantity: number,
    action: "add" | "remove" | "set",
  ): Promise<{ success: boolean; new_stock: number }> {
    const response = await api.post<{ success: boolean; new_stock: number }>(
      `/inventory/drinks/${drinkId}/update_stock/`,
      { quantity, action },
    );
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>("/inventory/categories/");
    return Array.isArray(response.data) ? response.data : [];
  }

  async getLowStockDrinks(threshold = 10): Promise<Drink[]> {
    const response = await api.get<Drink[]>(
      `/inventory/drinks/?stock__lte=${threshold}`,
    );
    return response.data;
  }
}

export default new InventoryService();