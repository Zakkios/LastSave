import http from "../../services/http";
import type { GameShortResponse, GameCompleteResponse, GameResponse } from "./types";

/**
 * TODO: Backend implementation required for GET /game/autocomplete
 */
const getAutocompleteGames = async (
  query: string,
  page: number,
): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get("/game/autocomplete", {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

/**
 * TODO: Backend implementation required for GET /game/:id
 */
const getGameById = async (id: string): Promise<GameCompleteResponse> => {
  try {
    const response = await http.get<GameCompleteResponse>(`/game/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

const getGameLibrary = async (): Promise<GameShortResponse[]> => {
  try {
    const response = await http.get<GameShortResponse[]>("/game/library");
    return response.data;
  } catch (error) {
    console.error("Error calling game library API:", error);
    throw error;
  }
};

/**
 * TODO: Backend implementation required for GET /game/random
 */
const getRandomGame = async (): Promise<GameResponse> => {
  try {
    const response = await http.get("/game/random");
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

export {
  getAutocompleteGames,
  getGameById,
  getGameLibrary,
  getRandomGame
};
