import { useCallback } from "react";
import { getMangaLibrary } from "../api";
import { MANGA_PAGE_LIMIT } from "../constants";
import type { MangaReadingStatus } from "../types";
import { usePaginatedList } from "../../../shared/hooks/usePaginatedList";

// Bibliothèque manga en scroll infini ; `status` filtre côté back (null : tous).
export const useMangaLibrary = (status: MangaReadingStatus | null = null) => {
  const fetchPage = useCallback(
    (page: number) => getMangaLibrary(page, status),
    [status],
  );

  return usePaginatedList(
    fetchPage,
    MANGA_PAGE_LIMIT,
    "Impossible de charger votre bibliothèque.",
  );
};
