import axios, { type InternalAxiosRequestConfig } from "axios";
import { env } from "../config/env";

interface AuthRetryConfig extends InternalAxiosRequestConfig {
  _authRetry?: boolean;
}

type AuthFailureListener = () => void;

const authRefreshExcludedPaths = new Set([
  "/login",
  "/register",
  "/token/refresh",
  "/token/logout",
]);
const authFailureListeners = new Set<AuthFailureListener>();
const recentRefreshWindowMs = 5_000;

const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshHttp = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshSessionRequest: Promise<void> | null = null;
let lastRefreshCompletedAt = 0;

export const subscribeToAuthFailure = (listener: AuthFailureListener) => {
  authFailureListeners.add(listener);

  return () => {
    authFailureListeners.delete(listener);
  };
};

const notifyAuthFailure = () => {
  authFailureListeners.forEach((listener) => {
    listener();
  });
};

const getRequestPath = (url: string | undefined) => {
  if (!url) {
    return "";
  }

  try {
    return new URL(url, env.apiBaseUrl).pathname;
  } catch {
    return url;
  }
};

const shouldRefreshAuth = (config: InternalAxiosRequestConfig | undefined) => {
  if (!config) {
    return false;
  }

  const retryConfig = config as AuthRetryConfig;

  if (retryConfig._authRetry) {
    return false;
  }

  return !authRefreshExcludedPaths.has(getRequestPath(config.url));
};

const isRefreshRejectedError = (error: unknown) => {
  return (
    axios.isAxiosError(error) &&
    (error.response?.status === 400 || error.response?.status === 401)
  );
};

const refreshSession = async () => {
  if (!refreshSessionRequest) {
    refreshSessionRequest = refreshHttp
      .post("/token/refresh")
      .then(() => {
        lastRefreshCompletedAt = Date.now();
      })
      .finally(() => {
        refreshSessionRequest = null;
      });
  }

  return refreshSessionRequest;
};

const hasRecentlyRefreshedSession = () => {
  return Date.now() - lastRefreshCompletedAt < recentRefreshWindowMs;
};

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      !shouldRefreshAuth(error.config)
    ) {
      throw error;
    }

    const originalRequest = error.config as AuthRetryConfig;
    originalRequest._authRetry = true;

    if (!hasRecentlyRefreshedSession()) {
      try {
        await refreshSession();
      } catch (refreshError) {
        if (isRefreshRejectedError(refreshError)) {
          notifyAuthFailure();
          throw error;
        }

        throw refreshError;
      }
    }

    return http(originalRequest);
  }
);

export default http;
