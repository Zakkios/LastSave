import http from "../../services/http";
import type { MangaCompleteResponse, MangaShortResponse } from "./types";

const getAutocompleteManga = async (
  query: string,
  page: number,
): Promise<MangaShortResponse[]> => {
  try {
    const response = await http.get("/manga/autocomplete", {
      params: {
        query,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getMangaById = async (id: string): Promise<MangaCompleteResponse> => {
  try {
    const response = await http.get(`/manga/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getMangaByPage = async (page: number): Promise<MangaShortResponse[]> => {
  try {
    const response = await http.get(`/manga/page/${page}`);
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

export { getAutocompleteManga, getMangaById, getMangaByPage };
