import { useCallback, useEffect, useState } from "react";
import { getMangaById } from "../api";
import type { MangaCompleteResponse } from "../types";

export const useMangaDetail = (mangaId: string | undefined) => {
  const [manga, setManga] = useState<MangaCompleteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManga = useCallback(async () => {
    if (!mangaId) {
      setManga(null);
      setError("Manga introuvable.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mangaData = await getMangaById(mangaId);
      setManga(mangaData);
    } catch (error) {
      console.error("Impossible de charger le manga :", error);
      setManga(null);
      setError("Impossible de charger ce manga.");
    } finally {
      setLoading(false);
    }
  }, [mangaId]);

  useEffect(() => {
    void fetchManga();
  }, [fetchManga]);

  return {
    manga,
    loading,
    error,
    refetch: fetchManga,
  };
};
