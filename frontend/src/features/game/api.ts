import http from "../../services/http";
import type { GameResponse } from "./types";

const getRandomGame = async (): Promise<GameResponse> => {
  try {
    const response = await http.get("/game/random");
    return response.data;
  } catch (error) {
    console.error("Error calling game API:", error);
    throw error;
  }
};

export default getRandomGame;
