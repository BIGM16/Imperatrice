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
  chiffre_affaires_mensuel: number;
  depenses_mensuelles: number;
  benefice_net_mensuel: number;
  total_boissons_vendues: number;
  chiffre_affaires_aujourd_hui: number;
  depenses_aujourd_hui: number;
  benefice_net_aujourd_hui: number;
  total_boissons_vendues_aujourd_hui: number;
  nombre_ventes_aujourd_hui: number;
  boissons_en_faible_stock: number;
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
