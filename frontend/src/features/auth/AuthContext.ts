import { createContext } from "react";
import type { AuthUser } from "./types";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  clearUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
