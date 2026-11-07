import http from "../../services/http";
import type {
  GameCompleteResponse,
  GameEntryPayload,
  GameShortResponse,
  GameStatus,
} from "./types";

const getAutocompleteGames = async (
  query: string,
  page: number,
): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get<GameShortResponse[]>("/game/autocomplete", {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

const getGameById = async (id: number): Promise<GameCompleteResponse> => {
  try {
    const response = await http.get<GameCompleteResponse>(`/game/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

// `status` : ne garder que les jeux de ce statut (filtré par le back).
const getGameLibrary = async (
  page: number,
  status: GameStatus | null = null,
): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get<GameShortResponse[]>(
      `/game/library/page/${page}`,
      { params: status ? { status } : undefined },
    );
    return response.data;
  } catch (error) {
    console.error("Error calling game library API:", error);
    throw error;
  }
};

// Jeux de la bibliothèque dont la sortie annoncée est à venir, le plus proche d'abord.
const getUpcomingGames = async (): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get<GameShortResponse[]>("/game/upcoming");
    return response.data;
  } catch (error) {
    console.error("Error calling upcoming games API:", error);
    throw error;
  }
};

const createGameEntry = async (payload: GameEntryPayload): Promise<void> => {
  try {
    await http.post("/game_entries", payload);
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

const updateGameEntry = async (payload: GameEntryPayload): Promise<void> => {
  try {
    await http.patch("/game_entries", payload);
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

// Retire le jeu de la bibliothèque (ajouté par erreur).
const deleteGameEntry = async (providerId: number): Promise<void> => {
  try {
    await http.delete(`/game_entries/${providerId}`);
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

export {
  deleteGameEntry,
  getAutocompleteGames,
  getGameById,
  getGameLibrary,
  getUpcomingGames,
  createGameEntry,
  updateGameEntry,
};
