import { useCallback } from "react";
import { getLatestFrenchChapters } from "../api";
import { useAsyncData } from "../../../shared/hooks/useAsyncData";

const NO_CHAPTERS: Record<string, number | null> = {};

// Derniers chapitres parus en français des mangas affichés, pour les badges « N nouveaux ».
export const useLatestFrenchChapters = (mangaIds: string[]) => {
  const idsKey = mangaIds.join(",");

  const fetchChapters = useCallback(
    () =>
      idsKey === ""
        ? Promise.resolve(NO_CHAPTERS)
        : getLatestFrenchChapters(idsKey.split(",")),
    [idsKey],
  );

  return useAsyncData(fetchChapters, "Impossible de charger les nouveaux chapitres.");
};
