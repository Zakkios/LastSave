import { useCallback } from "react";
import { getGameLibrary } from "../api";
import { GAME_PAGE_LIMIT } from "../constants";
import type { GameStatus } from "../types";
import { usePaginatedList } from "../../../shared/hooks/usePaginatedList";

// Bibliothèque de jeux en scroll infini ; `status` filtre côté back (null : tous).
export const useGameLibrary = (status: GameStatus | null = null) => {
  const fetchPage = useCallback(
    (page: number) => getGameLibrary(page, status),
    [status],
  );

  return usePaginatedList(
    fetchPage,
    GAME_PAGE_LIMIT,
    "Impossible de charger votre bibliothèque.",
  );
};
