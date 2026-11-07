import { useEffect, useState } from "react";
import { getMangaById } from "../api";
import type { MangaCompleteResponse } from "../types";

type MangaDetailResult = {
  mangaId: string;
  manga: MangaCompleteResponse | null;
  error: string | null;
};

export const useMangaDetail = (mangaId: string | undefined) => {
  // Dernier résultat reçu, associé à l'id demandé : tant qu'il ne correspond
  // pas à `mangaId`, le chargement est en cours (pas de setState synchrone).
  const [result, setResult] = useState<MangaDetailResult | null>(null);

  useEffect(() => {
    if (!mangaId) {
      return;
    }

    // Ignore la réponse d'un manga précédent arrivée après coup.
    let ignore = false;

    getMangaById(mangaId)
      .then((manga) => {
        if (!ignore) {
          setResult({ mangaId, manga, error: null });
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        console.error("Impossible de charger le manga :", error);
        setResult({
          mangaId,
          manga: null,
          error: "Impossible de charger ce manga.",
        });
      });

    return () => {
      ignore = true;
    };
  }, [mangaId]);

  if (!mangaId) {
    return { manga: null, loading: false, error: "Manga introuvable." };
  }

  const current = result?.mangaId === mangaId ? result : null;

  return {
    manga: current?.manga ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
};
