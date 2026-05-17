import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User } from "@/lib/api";
import { api } from "@/lib/api";
import { getStoredUser, storeUser, clearAuth } from "@/lib/auth";

// ─── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isUser: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = getStoredUser();
    // On startup: if we have a stored user + token, make sure api has the token
    if (stored && typeof window !== "undefined") {
      const token = localStorage.getItem("eventify_token");
      if (token) api.setToken(token);
    }
    return stored;
  });

  // Sync across browser tabs via storage events
  useEffect(() => {
    const handler = () => setUser(getStoredUser());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await api.signin(email, password);
    const u: User = response.user;
    const token: string = response.token;
    storeUser(u, token);
    api.setToken(token);
    setUser(u);           // ← single shared state update
    return u;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    const response = await api.signup(name, email, password, "user");
    const u: User = response.user;
    const token: string = response.token;
    storeUser(u, token);
    api.setToken(token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    api.clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
