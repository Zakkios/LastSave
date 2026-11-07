import { useCallback, useEffect, useRef, useState } from "react";
import { getGameLibrary } from "../api";
import { GAME_PAGE_LIMIT } from "../constants";
import type { GameShortResponse } from "../types";

export const useGameLibrary = () => {
  const [items, setItems] = useState<GameShortResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prochaine page à demander, et garde-fou contre deux chargements simultanés.
  const nextPageRef = useRef(0);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    let ignore = false;

    isFetchingRef.current = true;

    getGameLibrary(0)
      .then((data) => {
        if (ignore) {
          return;
        }

        setItems(data);
        setHasMore(data.length === GAME_PAGE_LIMIT);
        nextPageRef.current = 1;
      })
      .catch((err: unknown) => {
        if (ignore) {
          return;
        }

        console.error("Failed to fetch game library:", err);
        setError("Impossible de charger votre bibliothèque.");
        setHasMore(false);
      })
      .finally(() => {
        if (!ignore) {
          isFetchingRef.current = false;
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const fetchMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) {
      return;
    }

    const page = nextPageRef.current;
    isFetchingRef.current = true;

    try {
      const data = await getGameLibrary(page);
      setItems((prev) => [...prev, ...data]);
      setHasMore(data.length === GAME_PAGE_LIMIT);
      nextPageRef.current = page + 1;
    } catch (err) {
      console.error("Failed to fetch next game library page:", err);
      // Sans ça, le chargeur du scroll infini tournerait indéfiniment.
      setError("Impossible de charger la suite de votre bibliothèque.");
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [hasMore]);

  return {
    items,
    loading,
    hasMore,
    error,
    fetchMore,
  };
};
