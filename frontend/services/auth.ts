import api from "../lib/axios";

import type { User, LoginCredentials, LoginResponse } from "@/types/auth";

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("auth/login/", credentials);

    return response.data;
  }

  async me(): Promise<User> {
    const response = await api.get<User>("/auth/me/");
    return response.data;
  }

  async logout() {
    localStorage.removeItem("acces_token");
    localStorage.removeItem("refresh_token");

    return Promise.resolve();
  }
}

export default new AuthService();

