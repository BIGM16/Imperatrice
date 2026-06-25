export interface User {
  id: string | number;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: "admin" | "manager" | "staff" | string;
  avatar_url?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface Drink {
  id: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  price?: number;
  cost?: number;
  stock_quantity?: number;
  min_stock_level?: number;
  image_url?: string | null;
  is_active?: boolean;
  category?: Category;
  stock?: number;
  price_sale?: number;
  price_purchase?: number;
  benefice_unitaire?: number;
}

export interface Sale {
  id: string | number;
  user_id?: string;
  total_amount?: number;
  payment_method?: "cash" | "card" | "transfer";
  customer_name?: string | null;
  notes?: string | null;
  created_at?: string;
  user?: User;
  items?: SaleItem[];
  quantity?: number;
  total_price?: number;
  drink?: Drink;
  served_by?: User;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  drink_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  drink?: Drink;
}

export interface Expense {
  id: string;
  user_id?: string;
  category: string;
  amount: number;
  description?: string | null;
  receipt_url?: string | null;
  created_at?: string;
  user?: User;
  motif?: string;
  montant?: number;
  date?: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: User;
}

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
