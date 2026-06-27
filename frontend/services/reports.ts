import api from "../lib/axios";
import {
  DashboardStats,
  DashboardStatsRaw,
  FinanceReport,
  TopDrink,
  SalesByDay,
  SalesBySeller,
} from "@/types/reports";

class reportsService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStatsRaw>("/stats/");
      const d = response.data;
      return {
        revenueToday: d.sales_today ?? d.total_today_sales ?? 0,
        expensesToday: d.expenses_today ?? d.total_today_expenses ?? 0,
        netProfit: d.today_net_profit ?? 0,
        salesCount: d.sales_count ?? 0,
        lowStockCount: d.low_stock_drinks ?? 0,
        totalSalesMonth: d.total_sales ?? 0,
        totalExpensesMonth: d.total_expenses ?? 0,
        netProfitMonth: d.net_profit ?? 0,
      };
    } catch {
      return {
        revenueToday: 0,
        expensesToday: 0,
        netProfit: 0,
        salesCount: 0,
        lowStockCount: 0,
        totalSalesMonth: 0,
        totalExpensesMonth: 0,
        netProfitMonth: 0,
      };
    }
  }

  async getFinanceReport(
    startDate: string,
    endDate: string,
  ): Promise<FinanceReport> {
    try {
      const response = await api.get<FinanceReport>("/finance/", {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    } catch {
      return { total_sales: 0, total_expenses: 0, net_profit: 0 };
    }
  }

  async getTopDrinks(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<TopDrink[]> {
    try {
      const response = await api.get<TopDrink[]>("/top-drinks/", {
        params: {
          start_date: params?.startDate,
          end_date: params?.endDate,
          limit: params?.limit ?? 10,
        },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }

  async getSalesByDay(): Promise<SalesByDay[]> {
    try {
      const response = await api.get<SalesByDay[]>("/sales/by-day/");
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }

  async getSalesBySeller(): Promise<SalesBySeller[]> {
    try {
      const response = await api.get<SalesBySeller[]>("/sales/by-seller/");
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }

  async salesByDayToChartData(data: SalesByDay[]) {
    return data.map((d) => ({
      name: d.day,
      value: d.total_sales,
      count: d.sales_count,
    }));
  }

  async topDrinksToChartData(data: TopDrink[]) {
    return data.map((d) => ({
      name: d.drink_name,
      quantity: d.total_sold,
      revenue: d.revenue ?? 0,
    }));
  }

  async salesBySellerToChartData(data: SalesBySeller[]) {
    return data.map((d) => ({
      name: d.served_by__username,
      value: d.total_sales,
      items: d.total_items,
    }));
  }
}

export default new reportsService();