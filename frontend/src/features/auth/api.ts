import axios from "axios";
import http from "../../services/http";
import type {
  AuthApiErrorResponse,
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
