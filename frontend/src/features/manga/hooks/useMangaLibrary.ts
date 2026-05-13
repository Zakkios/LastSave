import { useState, useEffect } from "react";
import { getMangaLibrary } from "../api";
import type { MangaShortResponse } from "../types";

export const useMangaLibrary = () => {
  const [items, setItems] = useState<MangaShortResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMangaLibrary();
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch manga library:", err);
        setError("Impossible de charger votre bibliothèque.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  return {
    items,
    loading,
    error,
    refresh: async () => {
      setLoading(true);
      try {
        const data = await getMangaLibrary();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
};
