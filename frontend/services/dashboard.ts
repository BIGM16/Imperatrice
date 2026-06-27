import api from "../lib/axios";
import type {
  ChartData,
  TopSellingDrink,
  Activity,
  DashboardStats,
} from "@/types/dashboard";

import reportsService from "@/services/reports";

class dashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    const stats = await this.getDashboardStats();
    return {
      revenueToday: stats.revenueToday,
      expensesToday: stats.expensesToday,
      netProfit: stats.netProfit,
      salesCount: stats.salesCount,
      lowStockCount: stats.lowStockCount,
    };
  }

  async getDashboardSalesTrend(): Promise<ChartData[]> {
    try {
      const data = await reportsService.getSalesByDay();
      const Xdata = await reportsService.salesByDayToChartData(data);
      return Xdata.map((d) => ({
        name: d.name,
        value: d.value,
      }));
    } catch {
      return [];
    }
  }

  async getDashboardTopSellers(): Promise<TopSellingDrink[]> {
    try {
      const data = await reportsService.getTopDrinks({ limit: 5 });
      return data.map((d) => ({
        name: d.drink_name,
        quantity: d.total_sold,
        revenue: d.revenue ?? 0,
      }));
    } catch {
      return [];
    }
  }

  async getDashboardActivity(): Promise<Activity[]> {
    try {
      const response = await api.get<
        {
          id: string | number;
          drink_name?: string;
          drink?: { name?: string };
          total_price?: number;
          total_amount?: number;
          created_at?: string;
          served_by?: { username?: string; id?: number };
          seller_name?: string;
        }[]
      >("/sales/", { params: { ordering: "-created_at", limit: 10 } });

      const sales = Array.isArray(response.data) ? response.data : [];
      return sales.map((sale) => ({
        id: String(sale.id),
        type: "sale" as const,
        description: `Vente de ${sale.drink_name ?? sale.drink?.name ?? "boisson"} — ${
          sale.seller_name ?? sale.served_by?.username ?? "Staff"
        }`,
        amount: sale.total_price ?? sale.total_amount ?? 0,
        timestamp: sale.created_at ?? new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }
}

export default new dashboardService();
