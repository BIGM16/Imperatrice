import api from "../lib/axios";
import type { Sale, Drink } from "@/types/types";

// ─── Types locaux ─────────────────────────────────────────────────────────────

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

// ─── Ventes ───────────────────────────────────────────────────────────────────

/**
 * Récupère la liste des ventes (avec filtres optionnels).
 */
export async function getSales(params?: SaleListParams): Promise<Sale[]> {
  const response = await api.get<Sale[]>("/sales/", { params });
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Récupère une vente par son ID.
 */
export async function getSale(id: string | number): Promise<Sale> {
  const response = await api.get<Sale>(`/sales/${id}/`);
  return response.data;
}

/**
 * Crée une nouvelle vente (un seul article par appel — comportement du backend).
 * Pour un panier de plusieurs boissons, appeler cette fonction pour chaque ligne.
 */
export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const response = await api.post<Sale>("/sales/", payload);
  return response.data;
}

/**
 * Crée plusieurs ventes à partir d'un panier.
 * Retourne la liste des ventes créées.
 */
export async function createSalesFromCart(
  items: { drink: Drink; quantity: number }[]
): Promise<Sale[]> {
  const results = await Promise.all(
    items.map((item) =>
      createSale({
        drink_id: item.drink.id,
        quantity: item.quantity,
      })
    )
  );
  return results;
}

/**
 * Supprime une vente par son ID.
 */
export async function deleteSale(id: string | number): Promise<void> {
  await api.delete(`/sales/${id}/`);
}

/**
 * Récupère les dernières ventes (pour le dashboard).
 */
export async function getRecentSales(limit = 10): Promise<Sale[]> {
  const response = await api.get<Sale[]>("/sales/", {
    params: { ordering: "-created_at", limit },
  });
  return Array.isArray(response.data) ? response.data : [];
}
