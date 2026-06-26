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

export interface LoginCredentials{
  email : string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}