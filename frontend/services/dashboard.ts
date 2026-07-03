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
    try {
      const response = await api.get<{
        statistiques?: {
          chiffre_affaires_aujourd_hui?: number;
          depenses_aujourd_hui?: number;
          benefice_net_aujourd_hui?: number;
          nombre_ventes_aujourd_hui?: number;
          boissons_en_faible_stock?: number;
          chiffre_affaires_mensuel?: number;
          depenses_mensuelles?: number;
          benefice_net_mensuel?: number;
        };
      }>("/reports/dashboard/");

      const stats = response.data?.statistiques;
      return {
        revenueToday: stats?.chiffre_affaires_aujourd_hui ?? 0,
        expensesToday: stats?.depenses_aujourd_hui ?? 0,
        netProfit: stats?.benefice_net_aujourd_hui ?? 0,
        salesCount: stats?.nombre_ventes_aujourd_hui ?? 0,
        lowStockCount: stats?.boissons_en_faible_stock ?? 0,
      };
    } catch {
      return {
        revenueToday: 0,
        expensesToday: 0,
        netProfit: 0,
        salesCount: 0,
        lowStockCount: 0,
      };
    }
  }

  async getDashboardSalesTrend(): Promise<ChartData[]> {
    try {
      const data = await reportsService.getSalesByDay();
      return data.map((d) => ({
        name: d.day,
        value: d.total_sales,
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

  


  async getDashboard() {
    const response = await api.get("/reports/dashboard/");
    return response.data;
  }
}

const dashboardServiceInstance = new dashboardService();

export const getDashboardStats = () =>
  dashboardServiceInstance.getDashboardStats();
export const getDashboardSalesTrend = () =>
  dashboardServiceInstance.getDashboardSalesTrend();
export const getDashboardTopSellers = () =>
  dashboardServiceInstance.getDashboardTopSellers();
export const getDashboardActivity = () =>
  dashboardServiceInstance.getDashboardActivity();

export const getDashboard = () => dashboardServiceInstance.getDashboard();

export default dashboardServiceInstance;
