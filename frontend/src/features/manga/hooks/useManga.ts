import { useCallback, useState } from "react";
import { getMangaById, getRandomManga } from "../api";
import type { MangaResponse } from "../types";

export const useManga = () => {
  const [manga, setManga] = useState<MangaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomManga = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomManga();
      setManga(data);
    } catch (err) {
      setError("Impossible de récupérer un manga aléatoire.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { manga, loading, error, fetchRandomManga, fetchMangaById };
};
