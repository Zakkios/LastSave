import { useEffect, useState } from "react";
import axios from "axios";
import { getGameById } from "../api";
import type { GameCompleteResponse } from "../types";

type GameDetailResult = {
  gameId: number;
  game: GameCompleteResponse | null;
  error: string | null;
};

// L'id vient de l'URL (/game/:id) : un identifiant IGDB est un entier positif.
const parseGameId = (id: string | undefined): number | null => {
  if (!id || !/^\d+$/.test(id)) {
    return null;
  }

  const gameId = Number(id);

  return Number.isSafeInteger(gameId) && gameId > 0 ? gameId : null;
};

export const useGameDetail = (id: string | undefined) => {
  const gameId = parseGameId(id);

  // Dernier résultat reçu, associé à l'id demandé : tant qu'il ne correspond
  // pas à `gameId`, le chargement est en cours (pas de setState synchrone).
  const [result, setResult] = useState<GameDetailResult | null>(null);

  useEffect(() => {
    if (gameId === null) {
      return;
    }

    // Ignore la réponse d'un jeu précédent arrivée après coup.
    let ignore = false;

    getGameById(gameId)
      .then((game) => {
        if (!ignore) {
          setResult({ gameId, game, error: null });
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        console.error("Impossible de charger le jeu :", error);
        setResult({
          gameId,
          game: null,
          error:
            axios.isAxiosError(error) && error.response?.status === 404
              ? "Ce jeu n'existe pas sur IGDB."
              : "Impossible de charger ce jeu.",
        });
      });

    return () => {
      ignore = true;
    };
  }, [gameId]);

  if (gameId === null) {
    return { game: null, loading: false, error: "Jeu introuvable." };
  }

  const current = result?.gameId === gameId ? result : null;

  return {
    game: current?.game ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
};
