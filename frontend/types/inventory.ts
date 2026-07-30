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
  min_stock?: number;
  image_url?: string | null;
  is_active?: boolean;
  category?: Category;
  stock?: number;
  price_sale?: number;
  price_purchase?: number;
  benefice_unitaire?: number;
  quantity?: number;
}
