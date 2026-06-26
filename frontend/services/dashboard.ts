import api from "../lib/axios";
import type { ChartData, TopSellingDrink, Activity, DashboardStats } from "@/types/types";
import {
  getDashboardStats as getStatsFromReports,
  getTopDrinks,
  getSalesByDay,
  topDrinksToChartData,
  salesByDayToChartData,
} from "./reports";

// ─── Re-export normalisé pour la page Dashboard ───────────────────────────────

/**
 * Statistiques du tableau de bord (revenus, dépenses, profit, stock bas).
 * Endpoint: GET /api/v1/stats/
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const stats = await getStatsFromReports();
  return {
    revenueToday: stats.revenueToday,
    expensesToday: stats.expensesToday,
    netProfit: stats.netProfit,
    salesCount: stats.salesCount,
    lowStockCount: stats.lowStockCount,
  };
}

/**
 * Tendance des ventes par jour (pour le graphique linéaire).
 * Endpoint: GET /api/v1/sales/by-day/
 */
export async function getDashboardSalesTrend(): Promise<ChartData[]> {
  try {
    const data = await getSalesByDay();
    return salesByDayToChartData(data).map((d) => ({
      name: d.name,
      value: d.value,
    }));
  } catch {
    return [];
  }
}

/**
 * Top boissons vendues (pour le tableau "Top Sellers").
 * Endpoint: GET /api/v1/top-drinks/
 */
export async function getDashboardTopSellers(): Promise<TopSellingDrink[]> {
  try {
    const data = await getTopDrinks({ limit: 5 });
    return data.map((d) => ({
      name: d.drink_name,
      quantity: d.total_sold,
      revenue: d.revenue ?? 0,
    }));
  } catch {
    return [];
  }
}

/**
 * Activité récente (ventes récentes transformées en activités).
 * Endpoint: GET /api/v1/sales/?ordering=-created_at&limit=10
 */
export async function getDashboardActivity(): Promise<Activity[]> {
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
