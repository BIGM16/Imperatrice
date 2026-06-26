import api from "../lib/axios";
import type { Expense } from "@/types/types";

// ─── Types locaux ─────────────────────────────────────────────────────────────

export interface Personne {
  id: number;
  name: string;
}

export interface Depense {
  id: number;
  motif: string;
  montant: number;
  date: string;
  responsable?: number | null;
  responsible_name?: string;
}

export interface CreateDepensePayload {
  motif: string;
  montant: number;
  responsable?: number | null;
}

// ─── Dépenses ─────────────────────────────────────────────────────────────────

/**
 * Récupère toutes les dépenses.
 */
export async function getDepenses(): Promise<Depense[]> {
  const response = await api.get<Depense[]>("/depenses/");
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Crée une nouvelle dépense.
 */
export async function createDepense(
  payload: CreateDepensePayload
): Promise<Depense> {
  const response = await api.post<Depense>("/depenses/", payload);
  return response.data;
}

/**
 * Met à jour une dépense existante.
 */
export async function updateDepense(
  id: number,
  payload: Partial<CreateDepensePayload>
): Promise<Depense> {
  const response = await api.patch<Depense>(`/depenses/${id}/`, payload);
  return response.data;
}

/**
 * Supprime une dépense.
 */
export async function deleteDepense(id: number): Promise<void> {
  await api.delete(`/depenses/${id}/`);
}

// ─── Personnes ────────────────────────────────────────────────────────────────

/**
 * Récupère la liste des personnes (responsables de dépenses).
 */
export async function getPersonnes(): Promise<Personne[]> {
  const response = await api.get<Personne[]>("/personnes/");
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Crée une nouvelle personne.
 */
export async function createPersonne(name: string): Promise<Personne> {
  const response = await api.post<Personne>("/personnes/", { name });
  return response.data;
}

/**
 * Convertit un Depense backend en type Expense frontend.
 * Utile pour les pages qui utilisent encore l'interface générique Expense.
 */
export function depenseToExpense(d: Depense): Expense {
  return {
    id: String(d.id),
    category: "Dépense",
    amount: d.montant,
    description: d.motif,
    created_at: d.date,
    motif: d.motif,
    montant: d.montant,
    date: d.date,
  };
}
