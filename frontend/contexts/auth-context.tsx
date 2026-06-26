"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import * as AuthService from "@/services/auth";

import { LoginCredentials, User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;

  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;
  const refreshUser = async () => {
    try {
      const me = await AuthService.me();
      setUser(me);
    } catch {
      setUser(null);
    }
  };
  const login = async (credentials: LoginCredentials) => {
    const tokens = await AuthService.login(credentials);
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    await refreshUser();
  };
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  useEffect(() => {
    const initialize = async () => {
      if (localStorage.getItem("access_token")) {
        await refreshUser();
      }
      setLoading(false);
    };
    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


// import { User } from "@/types/types";
// import {
//   getCurrentUser,
//   login as loginUser,
//   logoutClient,
// } from "@/services/auth";

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       if (typeof window === "undefined") {
//         return;
//       }

//       const accessToken = window.localStorage.getItem("access_token");
//       if (!accessToken) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const currentUser = await getCurrentUser();
//         setUser(currentUser);
//       } catch {
//         logoutClient();
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     try {
//       await loginUser(email, password);
//       const currentUser = await getCurrentUser();
//       setUser(currentUser);
//       return true;
//     } catch {
//       setUser(null);
//       logoutClient();
//       return false;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     logoutClient();
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


