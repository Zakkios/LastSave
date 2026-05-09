import { useCallback, useEffect, useRef, useState } from "react";
import { getMangaByPage } from "../api";
import { MANGA_PAGE_LIMIT } from "../constants";
import type { MangaShortResponse } from "../types";

export const useMangaInfiniteList = () => {
  const [items, setItems] = useState<MangaShortResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) {
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const newItems = await getMangaByPage(pageRef.current);

      setItems((prevItems) => [...prevItems, ...newItems]);
      pageRef.current += 1;

      if (newItems.length < MANGA_PAGE_LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Impossible de charger les mangas :", error);
      setError("Impossible de charger les mangas.");
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => {
    void fetchMore();
  }, [fetchMore]);

  return {
    items,
    hasMore,
    loading,
    error,
    fetchMore,
  };
};
