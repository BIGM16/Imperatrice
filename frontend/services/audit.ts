import api from "../lib/axios";
import type { AuditLog } from "@/types/audit";

export interface AuditLogListParams {
  action?: string;
  entity_type?: string;
  user?: string | number;
  search?: string;
  ordering?: string;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Récupère les journaux d'audit.
 * Le backend expose cet endpoint via apps.common.
 */
export async function getAuditLogs(
  params?: AuditLogListParams,
): Promise<AuditLog[]> {
  try {
    const response = await api.get<AuditLog[]>("/audit-logs/", { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

/**
 * Récupère un seul log d'audit.
 */
export async function getAuditLog(id: string | number): Promise<AuditLog> {
  const response = await api.get<AuditLog>(`/audit-logs/${id}/`);
  return response.data;
}
