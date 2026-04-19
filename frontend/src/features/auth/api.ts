import axios from "axios";
import http from "../../services/http";
import type {
  AuthApiErrorResponse,
  RegisterPayload,
  RegisterResponse,
} from "./types";

const registerErrorMessages: Record<string, string> = {
  "Invalid JSON": "La requête envoyée est invalide.",
  "Missing fields": "Tous les champs sont obligatoires.",
  "Invalid email": "Adresse email invalide.",
  "Password must be at least 8 characters":
    "Le mot de passe doit contenir au moins 8 caractères.",
  "User already exists": "Un compte existe déjà avec cette adresse email.",
};

const getRegisterErrorMessage = (message?: string) => {
  if (!message) {
    return "Impossible de créer le compte pour le moment.";
  }

  return registerErrorMessages[message] ?? message;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const response = await http.post<RegisterResponse>("/register", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<AuthApiErrorResponse>(error)) {
      throw new Error(getRegisterErrorMessage(error.response?.data?.message));
    }

    throw error;
  }
};
