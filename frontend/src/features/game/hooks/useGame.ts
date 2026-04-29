import { useCallback, useState } from "react";
import getRandomGame from "../api";
import type { GameResponse } from "../types";

export const useGame = () => {
  const [game, setGame] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRandomGame();
      setGame(data);
    } catch (err) {
      setError("Impossible de récupérer un jeu aléatoire.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { game, loading, error, fetchRandomGame };
};
