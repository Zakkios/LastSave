import http from "../../services/http";
import type { MangaResponse } from "./types";

const getRandomManga = async (): Promise<MangaResponse> => {
  try {
    const response = await http.get("/manga/random");
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getAutocompleteManga = async (
  query: string,
): Promise<MangaResponse[]> => {
  try {
    const response = await http.get(`/manga/autocomplete?q=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getMangaById = async (id: string): Promise<MangaResponse> => {
  try {
    const response = await http.get(`/manga/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

export { getRandomManga, getAutocompleteManga, getMangaById };
