import { User }  from "@/types/auth";


export interface DashboardStats {
  revenueToday: number;
  expensesToday: number;
  netProfit: number;
  salesCount: number;
  lowStockCount: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TopSellingDrink {
  name: string;
  quantity: number;
  revenue: number;
}

export interface Activity {
  id: string;
  type: "sale" | "expense" | "inventory" | "user";
  description: string;
  amount?: number;
  timestamp: string;
  user?: User;
}


