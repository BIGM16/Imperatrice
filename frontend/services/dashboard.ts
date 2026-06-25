import api from "../lib/axios";
import type {
  ChartData,
  TopSellingDrink,
  Activity,
  DashboardStats,
} from "@/types/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await api.get<DashboardStats>("/stats/");
    return response.data;
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

export async function getDashboardSalesTrend(): Promise<ChartData[]> {
  try {
    const response = await api.get<ChartData[]>(
      "/sales/?ordering=-created_at&limit=7",
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function getDashboardTopSellers(): Promise<TopSellingDrink[]> {
  try {
    const response = await api.get<TopSellingDrink[]>("/sales/");
    return response.data;
  } catch {
    return [];
  }
}

export async function getDashboardActivity(): Promise<Activity[]> {
  try {
    const response = await api.get<Activity[]>("/me/");
    return response.data as unknown as Activity[];
  } catch {
    return [];
  }
}
