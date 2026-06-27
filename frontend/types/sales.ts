import { User } from "@/types/auth";
import { Drink } from "./inventory";

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


export interface CreateSalePayload {
  /** ID de la boisson (drink_id OU drink sont acceptés par le backend) */
  drink_id: number | string;
  quantity: number;
}

export interface SaleListParams {
  search?: string;
  ordering?: string;
  served_by?: number | string;
  drink?: number | string;
  limit?: number;
  offset?: number;
}