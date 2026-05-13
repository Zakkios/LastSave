import { useState, useEffect, useCallback } from "react";
import { getMangaLibrary } from "../api";
import type { MangaShortResponse } from "../types";

const PAGE_SIZE = 20;

export const useMangaLibrary = () => {
  const [items, setItems] = useState<MangaShortResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMangaLibrary(0);
        setItems(data);
        setHasMore(data.length === PAGE_SIZE);
        setPage(0);
      } catch (err) {
        console.error("Failed to fetch manga library:", err);
        setError("Impossible de charger votre bibliothèque.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const fetchMore = useCallback(async () => {
    const nextPage = page + 1;
    try {
      const data = await getMangaLibrary(nextPage);
      setItems((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch next page:", err);
    }
  }, [page]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMangaLibrary(0);
      setItems(data);
      setHasMore(data.length === PAGE_SIZE);
      setPage(0);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger votre bibliothèque.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    hasMore,
    error,
    fetchMore,
    refresh,
  };
};