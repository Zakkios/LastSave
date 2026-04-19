import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { subscribeToAuthFailure } from "../../services/http";
import {
  AuthContext,
  type AuthContextValue,
  type AuthStatus,
} from "./AuthContext";
import { getCurrentUser } from "./api";
import type { AuthUser } from "./types";

interface AuthProviderProps {
  children: ReactNode;
}

const sessionCheckErrorMessage =
  "Impossible de vérifier votre session pour le moment.";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const sessionRequestId = useRef(0);

  const refreshUser = useCallback(async () => {
    const requestId = sessionRequestId.current + 1;
    sessionRequestId.current = requestId;

    setStatus("loading");
    setError(null);

    try {
      const currentUser = await getCurrentUser();

      if (requestId !== sessionRequestId.current) {
        return null;
      }

      setUser(currentUser);
      setStatus(currentUser ? "authenticated" : "unauthenticated");

      return currentUser;
    } catch {
      if (requestId !== sessionRequestId.current) {
        return null;
      }

      setUser(null);
      setStatus("error");
      setError(sessionCheckErrorMessage);

      return null;
    }
  }, []);

  const clearUser = useCallback(() => {
    sessionRequestId.current += 1;
    setUser(null);
    setStatus("unauthenticated");
    setError(null);
  }, []);

  useEffect(() => {
    return subscribeToAuthFailure(clearUser);
  }, [clearUser]);

  useEffect(() => {
    const requestId = sessionRequestId.current + 1;
    sessionRequestId.current = requestId;

    const loadCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (requestId !== sessionRequestId.current) {
          return;
        }

        setUser(currentUser);
        setStatus(currentUser ? "authenticated" : "unauthenticated");
      } catch {
        if (requestId !== sessionRequestId.current) {
          return;
        }

        setUser(null);
        setStatus("error");
        setError(sessionCheckErrorMessage);
      }
    };

    void loadCurrentUser();

    return () => {
      sessionRequestId.current += 1;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === "authenticated",
      refreshUser,
      clearUser,
    }),
    [clearUser, error, refreshUser, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
