import axios from "axios";
import http from "../../services/http";
import type {
  AuthApiErrorResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
} from "./types";

const loginErrorMessages: Record<string, string> = {
  "Invalid credentials.": "Adresse email ou mot de passe incorrect.",
  "Invalid credentials": "Adresse email ou mot de passe incorrect.",
  "Bad credentials.": "Adresse email ou mot de passe incorrect.",
  "Bad credentials": "Adresse email ou mot de passe incorrect.",
  "Missing credentials.": "Renseignez votre email et votre mot de passe.",
};

const registerErrorMessages: Record<string, string> = {
  "Invalid JSON": "La requête envoyée est invalide.",
  "Missing fields": "Tous les champs sont obligatoires.",
  "Invalid email": "Adresse email invalide.",
  "Password must be at least 8 characters":
    "Le mot de passe doit contenir au moins 8 caractères.",
  "User already exists": "Un compte existe déjà avec cette adresse email.",
};

const getAuthErrorMessage = (
  message: string | undefined,
  messages: Record<string, string>,
  fallback: string
) => {
  if (!message) {
    return fallback;
  }

  return messages[message] ?? message;
};

const isUnauthorizedError = (error: unknown) => {
  return axios.isAxiosError(error) && error.response?.status === 401;
};

const isRefreshRejectedError = (error: unknown) => {
  return (
    axios.isAxiosError(error) &&
    (error.response?.status === 400 || error.response?.status === 401)
  );
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response = await http.post<RegisterResponse>("/register", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<AuthApiErrorResponse>(error)) {
      throw new Error(
        getAuthErrorMessage(
          error.response?.data?.message,
          registerErrorMessages,
          "Impossible de créer le compte pour le moment."
        )
      );
    }

    throw error;
  }
};

export const loginUser = async (
  payload: LoginPayload
): Promise<void> => {
  try {
    await http.post("/login", payload);
  } catch (error) {
    if (axios.isAxiosError<AuthApiErrorResponse>(error)) {
      throw new Error(
        getAuthErrorMessage(
          error.response?.data?.message,
          loginErrorMessages,
          "Impossible de se connecter pour le moment."
        )
      );
    }

    throw error;
  }
};

const fetchCurrentUser = async () => {
  const response = await http.get<AuthUser>("/me");
  return response.data;
};

const refreshSession = async () => {
  try {
    await http.post("/token/refresh");
    return true;
  } catch (error) {
    if (isRefreshRejectedError(error)) {
      return false;
    }

    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    return await fetchCurrentUser();
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error;
    }
  }

  const hasRefreshedSession = await refreshSession();

  if (!hasRefreshedSession) {
    return null;
  }

  try {
    return await fetchCurrentUser();
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null;
    }

    throw error;
  }
};
