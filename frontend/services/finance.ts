import api from "../lib/axios";
import type {
  Depense,
  Expense,
  Personne,
  CreateDepensePayload,
} from "@/types/finance";

class financeService {
  async getDepenses(): Promise<Depense[]> {
    const response = await api.get<Depense[]>("/depenses/");
    return Array.isArray(response.data) ? response.data : [];
  }

  async createDepense(payload: CreateDepensePayload): Promise<Depense> {
    const response = await api.post<Depense>("/depenses/", payload);
    return response.data;
  }

  async updateDepense(
    id: number,
    payload: Partial<CreateDepensePayload>,
  ): Promise<Depense> {
    const response = await api.patch<Depense>(`/depenses/${id}/`, payload);
    return response.data;
  }

  async deleteDepense(id: number): Promise<void> {
    await api.delete(`/depenses/${id}/`);
  }

  async getPersonnes(): Promise<Personne[]> {
    const response = await api.get<Personne[]>("/personnes/");
    return Array.isArray(response.data) ? response.data : [];
  }

  async createPersonne(name: string): Promise<Personne> {
    const response = await api.post<Personne>("/personnes/", { name });
    return response.data;
  }

  async depenseToExpense(d: Depense): Promise<Expense> {
    return {
      id: String(d.id),
      category: "Dépense",
      amount: Number(d.montant),
      description: d.motif,
      created_at: d.date,
      motif: d.motif,
      montant: Number(d.montant),
      date: d.date,
      responsable_nom: d.responsable_nom ?? null,
    };
  }
}

const financeServiceInstance = new financeService();

export const getDepenses = () => financeServiceInstance.getDepenses();
export const createDepense = (payload: CreateDepensePayload) =>
  financeServiceInstance.createDepense(payload);
export const updateDepense = (
  id: number,
  payload: Partial<CreateDepensePayload>,
) => financeServiceInstance.updateDepense(id, payload);
export const deleteDepense = (id: number) =>
  financeServiceInstance.deleteDepense(id);
export const getPersonnes = () => financeServiceInstance.getPersonnes();
export const createPersonne = (name: string) =>
  financeServiceInstance.createPersonne(name);
export const depenseToExpense = (d: Depense) =>
  financeServiceInstance.depenseToExpense(d);

export default financeServiceInstance;
