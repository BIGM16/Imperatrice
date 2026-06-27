import api from "../lib/axios";
import type {
  Sale,
  SaleItem,
  SaleListParams,
  CreateSalePayload,
} from "@/types/sales";
import { Drink } from "@/types/inventory";

class saleService {
  async getSales(params?: SaleListParams): Promise<Sale[]> {
    const response = await api.get<Sale[]>("/sales/", { params });
    return Array.isArray(response.data) ? response.data : [];
  }

  async getSale(id: string | number): Promise<Sale> {
    const response = await api.get<Sale>(`/sales/${id}/`);
    return response.data;
  }

  async createSale(payload: CreateSalePayload): Promise<Sale> {
    const response = await api.post<Sale>("/sales/", payload);
    return response.data;
  }

  async createSalesFromCart(
    items: { drink: Drink; quantity: number }[],
  ): Promise<Sale[]> {
    const results = await Promise.all(
      items.map((item) =>
        this.createSale({
          drink_id: item.drink.id,
          quantity: item.quantity,
        }),
      ),
    );
    return results;
  }

  async deleteSale(id: string | number): Promise<void> {
    await api.delete(`/sales/${id}/`);
  }

  async getRecentSales(limit = 10): Promise<Sale[]> {
    const response = await api.get<Sale[]>("/sales/", {
      params: { ordering: "-created_at", limit },
    });
    return Array.isArray(response.data) ? response.data : [];
  }
}
export default new saleService();
