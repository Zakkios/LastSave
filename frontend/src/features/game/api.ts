import http from "../../services/http";
import type {
  GameCompleteResponse,
  GameEntryPayload,
  GameShortResponse,
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

const getGameLibrary = async (page: number): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get<GameShortResponse[]>(
      `/game/library/page/${page}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error calling game library API:", error);
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

export {
  getAutocompleteGames,
  getGameById,
  getGameLibrary,
  createGameEntry,
  updateGameEntry,
};
