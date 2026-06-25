import api from "../lib/axios";
import type { User } from "@/types/types";

interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login/", {
    email,
    password,
  });
  const { access, refresh } = response.data;

  if (typeof window !== "undefined") {
    window.localStorage.setItem("access_token", access);
    window.localStorage.setItem("refresh_token", refresh);
  }

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/me/");
  return response.data;
}

export function logoutClient(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
  }
}
