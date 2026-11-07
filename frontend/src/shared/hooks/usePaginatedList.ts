import { useCallback, useEffect, useRef, useState } from "react";

type PageFetcher<T> = (page: number) => Promise<T[]>;

type ListState<T> = {
  // Fonction qui a produit ces données : permet de savoir si elles sont à jour.
  fetchPage: PageFetcher<T>;
  items: T[];
  nextPage: number;
  hasMore: boolean;
  error: string | null;
};

const NO_ITEMS: never[] = [];

/**
 * Liste chargée page par page (bibliothèques en scroll infini).
 * `fetchPage` doit être stable (useCallback) : quand elle change (autre statut
 * filtré, par exemple), la liste repart de la page 0.
 */
export const usePaginatedList = <T>(
  fetchPage: PageFetcher<T>,
  pageSize: number,
  errorMessage: string,
) => {
  const [state, setState] = useState<ListState<T> | null>(null);
  // Garde-fou : le scroll infini peut demander la suite deux fois de suite.
  const isFetchingMoreRef = useRef(false);

  useEffect(() => {
    // Ignore la réponse d'une ancienne liste (filtre changé entre-temps).
    let ignore = false;

    fetchPage(0)
      .then((items) => {
        if (!ignore) {
          setState({
            fetchPage,
            items,
            nextPage: 1,
            hasMore: items.length === pageSize,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (ignore) {
          return;
        }

        console.error(errorMessage, error);
        setState({
          fetchPage,
          items: [],
          nextPage: 0,
          hasMore: false,
          error: errorMessage,
        });
      });

    return () => {
      ignore = true;
    };
  }, [fetchPage, pageSize, errorMessage]);

  // Tant que les données ne viennent pas de la `fetchPage` actuelle, la première
  // page est en cours de chargement (pas de setState synchrone dans l'effet).
  const current = state?.fetchPage === fetchPage ? state : null;

  const fetchMore = useCallback(async () => {
    if (!current || !current.hasMore || isFetchingMoreRef.current) {
      return;
    }

    const page = current.nextPage;
    isFetchingMoreRef.current = true;

    try {
      const items = await fetchPage(page);

      setState((prev) =>
        prev?.fetchPage === fetchPage
          ? {
              ...prev,
              items: [...prev.items, ...items],
              nextPage: page + 1,
              hasMore: items.length === pageSize,
            }
          : prev,
      );
    } catch (error) {
      console.error(errorMessage, error);
      // Sans ça, le chargeur du scroll infini tournerait indéfiniment.
      setState((prev) =>
        prev?.fetchPage === fetchPage
          ? { ...prev, hasMore: false, error: errorMessage }
          : prev,
      );
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [current, fetchPage, pageSize, errorMessage]);

  return {
    items: current?.items ?? (NO_ITEMS as T[]),
    loading: current === null,
    hasMore: current?.hasMore ?? false,
    error: current?.error ?? null,
    fetchMore,
  };
};
