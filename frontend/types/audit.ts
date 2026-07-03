import { User } from "@/types/auth";

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  object_id: string;
  description: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: User;
  utilisateur?: User;
}