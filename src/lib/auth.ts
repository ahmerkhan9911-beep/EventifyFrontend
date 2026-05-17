import type { User } from "./api";

const USER_KEY = "eventify_user";
const TOKEN_KEY = "eventify_token";

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User, token: string) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuth() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdmin(): boolean {
  const user = getStoredUser();
  return user?.role === "admin";
}

export function isLoggedIn(): boolean {
  return !!getStoredUser();
}
