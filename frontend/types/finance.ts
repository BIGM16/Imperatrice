import { User }  from "@/types/auth";

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
  responsable_nom?: string | null;
}

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
  responsable_nom?: string | null;
  responsible_name?: string;
}

export interface CreateDepensePayload {
  motif: string;
  montant: number;
  responsable?: number | null;
}