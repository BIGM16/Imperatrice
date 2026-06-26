import api from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Réponse de /reports/stats/ */
export interface DashboardStatsRaw {
  total_sales: number;
  today_sales: unknown[];     // queryset sérialisé — pas utilisé directement
  total_expenses: number;
  today_expenses: unknown[];  // queryset sérialisé — pas utilisé directement
  total_drinks_sold: number;
  net_profit: number;
  sales_today: number;
  expenses_today: number;
  sales_count: number;
  low_stock_drinks: number;
  today_net_profit: number;
  total_today_sales: number;
  total_today_expenses: number;
}

/** Forme normalisée utilisée par la page Dashboard */
export interface DashboardStats {
  revenueToday: number;
  expensesToday: number;
  netProfit: number;
  salesCount: number;
  lowStockCount: number;
  totalSalesMonth: number;
  totalExpensesMonth: number;
  netProfitMonth: number;
}

/** Réponse de /reports/finance/ */
export interface FinanceReport {
  total_sales: number;
  total_expenses: number;
  net_profit: number;
}

/** Réponse de /reports/top-drinks/ */
export interface TopDrink {
  drink_name: string;
  total_sold: number;
  /** présent si annotated (voir service backend) */
  revenue?: number;
}

/** Réponse de /reports/sales/by-day/ */
export interface SalesByDay {
  day: string;
  total_sales: number;
  sales_count: number;
}

/** Réponse de /reports/sales/by-seller/ */
export interface SalesBySeller {
  served_by__id: number;
  served_by__username: string;
  total_sales: number;
  total_items: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Récupère les statistiques agrégées du tableau de bord.
 * Endpoint: GET /api/v1/stats/
 */
export async function getDashboardStats(): Promise<DashboardStats> {
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

// ─── Finance Report ───────────────────────────────────────────────────────────

/**
 * Rapport financier pour une plage de dates.
 * Endpoint: GET /api/v1/finance/?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 */
export async function getFinanceReport(
  startDate: string,
  endDate: string
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

// ─── Top Drinks ───────────────────────────────────────────────────────────────

/**
 * Les boissons les plus vendues sur une période.
 * Endpoint: GET /api/v1/top-drinks/?start_date=...&end_date=...&limit=10
 */
export async function getTopDrinks(params?: {
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

// ─── Sales By Day ─────────────────────────────────────────────────────────────

/**
 * Ventes regroupées par jour.
 * Endpoint: GET /api/v1/sales/by-day/
 */
export async function getSalesByDay(): Promise<SalesByDay[]> {
  try {
    const response = await api.get<SalesByDay[]>("/sales/by-day/");
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

// ─── Sales By Seller ──────────────────────────────────────────────────────────

/**
 * Ventes regroupées par vendeur.
 * Endpoint: GET /api/v1/sales/by-seller/
 */
export async function getSalesBySeller(): Promise<SalesBySeller[]> {
  try {
    const response = await api.get<SalesBySeller[]>("/sales/by-seller/");
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

// ─── Chart helpers ────────────────────────────────────────────────────────────

/** Transforme SalesByDay en données prêtes pour Recharts */
export function salesByDayToChartData(data: SalesByDay[]) {
  return data.map((d) => ({
    name: d.day,
    value: d.total_sales,
    count: d.sales_count,
  }));
}

/** Transforme TopDrink en données prêtes pour Recharts */
export function topDrinksToChartData(data: TopDrink[]) {
  return data.map((d) => ({
    name: d.drink_name,
    quantity: d.total_sold,
    revenue: d.revenue ?? 0,
  }));
}

/** Transforme SalesBySeller en données prêtes pour Recharts */
export function salesBySellerToChartData(data: SalesBySeller[]) {
  return data.map((d) => ({
    name: d.served_by__username,
    value: d.total_sales,
    items: d.total_items,
  }));
}
