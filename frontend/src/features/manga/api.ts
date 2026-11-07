import http from "../../services/http";
import type {
  MangaCompleteResponse,
  MangaEntryPayload,
  MangaReadingStatus,
  MangaShortResponse,
} from "./types";

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
    const response = await http.get<MangaCompleteResponse>(`/manga/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getMangaByPage = async (page: number): Promise<MangaShortResponse[]> => {
  try {
    const response = await http.get<MangaShortResponse[]>(
      `/manga/page/${page}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const createMangaEntry = async (payload: MangaEntryPayload): Promise<void> => {
  try {
    await http.post("/manga_entries", payload);
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const updateMangaEntry = async (payload: MangaEntryPayload): Promise<void> => {
  try {
    await http.patch(`/manga_entries`, payload);
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

// `status` : ne garder que les mangas de ce statut (filtré par le back).
// Retire le manga de la bibliothèque (ajouté par erreur).
const deleteMangaEntry = async (providerId: string): Promise<void> => {
  try {
    await http.delete(`/manga_entries/${providerId}`);
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

const getMangaLibrary = async (
  page: number,
  status: MangaReadingStatus | null = null,
): Promise<MangaShortResponse[]> => {
  try {
    const response = await http.get<MangaShortResponse[]>(
      `/manga/library/page/${page}`,
      { params: status ? { status } : undefined },
    );
    return response.data;
  } catch (error) {
    console.error("Error calling manga library API:", error);
    throw error;
  }
};

export {
  getAutocompleteManga,
  getMangaById,
  getMangaByPage,
  createMangaEntry,
  updateMangaEntry,
  deleteMangaEntry,
  getMangaLibrary,
};
