import { useEffect, useState } from "react";

type AsyncDataState<T> = {
  // Fonction qui a produit ces données : permet de savoir si elles sont à jour.
  fetchData: () => Promise<T>;
  data: T | null;
  error: string | null;
};

/**
 * Charge une donnée une fois, à l'affichage (chiffres, listes courtes…).
 * `fetchData` doit être stable : une fonction d'`api.ts` passée telle quelle.
 */
export const useAsyncData = <T>(
  fetchData: () => Promise<T>,
  errorMessage: string,
) => {
  const [state, setState] = useState<AsyncDataState<T> | null>(null);

  useEffect(() => {
    let ignore = false;

    fetchData()
      .then((data) => {
        if (!ignore) {
          setState({ fetchData, data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        console.error(errorMessage, error);
        setState({ fetchData, data: null, error: errorMessage });
      });

    return () => {
      ignore = true;
    };
  }, [fetchData, errorMessage]);

  const current = state?.fetchData === fetchData ? state : null;

  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? null,
  };
};
