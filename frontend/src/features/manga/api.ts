import http from "../../services/http";
import type {
  MangaAdvanceResponse,
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

// Retire le manga de la bibliothèque (ajouté par erreur).
const deleteMangaEntry = async (providerId: string): Promise<void> => {
  try {
    await http.delete(`/manga_entries/${providerId}`);
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

// +1 : un chapitre ou un tome de plus (selon le format) ; un manga « À lire » passe « En cours ».
const advanceMangaEntry = async (
  providerId: string,
): Promise<MangaAdvanceResponse> => {
  try {
    const response = await http.post<MangaAdvanceResponse>(
      `/manga_entries/${providerId}/advance`,
    );
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

// `status` : ne garder que les mangas de ce statut (filtré par le back).
// Le back renvoie des MangaCompleteDTO (fin de série comprise).
const getMangaLibrary = async (
  page: number,
  status: MangaReadingStatus | null = null,
): Promise<MangaCompleteResponse[]> => {
  try {
    const response = await http.get<MangaCompleteResponse[]>(
      `/manga/library/page/${page}`,
      { params: status ? { status } : undefined },
    );
    return response.data;
  } catch (error) {
    console.error("Error calling manga library API:", error);
    throw error;
  }
};

// Dernier chapitre paru en français de chaque manga demandé (12 au plus), indexé par id.
// Seuls les mangas de la liste suivis en chapitres sont renvoyés.
const getLatestFrenchChapters = async (
  mangaIds: string[],
): Promise<Record<string, number | null>> => {
  try {
    const response = await http.get<Record<string, number | null>>(
      "/manga/latest-chapters",
      { params: { ids: mangaIds.join(",") } },
    );
    return response.data;
  } catch (error) {
    console.error("Error calling manga latest chapters API:", error);
    throw error;
  }
};

// Mangas « Terminé » dont un nouveau chapitre est paru en français (série encore en cours).
const getResumableMangas = async (): Promise<MangaCompleteResponse[]> => {
  try {
    const response = await http.get<MangaCompleteResponse[]>("/manga/resumable");
    return response.data;
  } catch (error) {
    console.error("Error calling resumable mangas API:", error);
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
  advanceMangaEntry,
  getMangaLibrary,
  getLatestFrenchChapters,
  getResumableMangas,
};
