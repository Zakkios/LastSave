import { useCallback, useState } from "react";
import { getMangaById, getMangaByPage } from "../api";
import type { MangaCompleteResponse, MangaShortResponse } from "../types";

export const useManga = () => {
  const [manga, setManga] = useState<MangaCompleteResponse | null>(null);
  const [mangaList, setMangaList] = useState<MangaShortResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMangaById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMangaById(id);
      setManga(data);
    } catch (err) {
      setError("Impossible de charger le manga.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMangaByPage = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMangaByPage(page);
      setMangaList(data);
    } catch (err) {
      setError("Impossible de charger les mangas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    manga,
    mangaList,
    loading,
    error,
    fetchMangaById,
    fetchMangaByPage,
  };
};
