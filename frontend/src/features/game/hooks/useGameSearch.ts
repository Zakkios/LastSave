import { useCallback, useEffect, useRef, useState } from "react";
import { getAutocompleteGames } from "../api";
import type { GameShortResponse } from "../types";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { GAME_SEARCH_LIMIT } from "../constants";

const NO_RESULTS: GameShortResponse[] = [];

// Même fonctionnement que useMangaSearch. La saisie appartient à la page :
// elle passe une chaîne vide quand l'onglet Jeux n'est pas affiché.
export const useGameSearch = (query: string) => {
  const [results, setResults] = useState<GameShortResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Un peu plus long que pour les mangas : IGDB limite à 4 requêtes par seconde.
  const debouncedQuery = useDebounce(query, 300);
  const isQueryTooShort = debouncedQuery.trim().length < 2;
  // Saisie pas encore partie (délai en cours) : compte comme une recherche en
  // cours, pour ne pas afficher « Aucun résultat » le temps du délai.
  const isWaitingForDebounce =
    query.trim().length >= 2 && query.trim() !== debouncedQuery.trim();

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  const currentQueryRef = useRef("");

  useEffect(() => {
    const cleanQuery = debouncedQuery.trim();
    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    currentQueryRef.current = cleanQuery;

    // Requête trop courte : rien à charger. Les résultats sont masqués au rendu
    // (voir le return) plutôt que vidés ici par un setState dans l'effet.
    if (cleanQuery.length < 2) {
      pageRef.current = 0;
      isFetchingRef.current = false;
      return;
    }

    const fetchFirstPage = async () => {
      isFetchingRef.current = true;
      setIsSearching(true);
      setError(null);

      try {
        const data = await getAutocompleteGames(cleanQuery, 0);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults(data);
        pageRef.current = 1;
        setHasMore(data.length === GAME_SEARCH_LIMIT);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error("Error fetching game autocomplete results:", err);
        setError("Une erreur est survenue lors de la recherche.");
        setResults([]);
        setHasMore(false);
      } finally {
        if (requestId === requestIdRef.current) {
          isFetchingRef.current = false;
          setIsSearching(false);
        }
      }
    };

    void fetchFirstPage();
  }, [debouncedQuery]);

  const fetchMore = useCallback(async () => {
    const cleanQuery = currentQueryRef.current;

    if (isFetchingRef.current || !hasMore || cleanQuery.length < 2) {
      return;
    }

    const requestId = requestIdRef.current;
    const nextPage = pageRef.current;

    isFetchingRef.current = true;
    setIsSearching(true);

    try {
      const data = await getAutocompleteGames(cleanQuery, nextPage);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setResults((prev) => [...prev, ...data]);
      pageRef.current = nextPage + 1;
      setHasMore(data.length === GAME_SEARCH_LIMIT);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error("Error fetching more game autocomplete results:", err);
      setError("Impossible de charger plus de résultats.");
      setHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        isFetchingRef.current = false;
        setIsSearching(false);
      }
    }
  }, [hasMore]);

  return {
    results: isQueryTooShort ? NO_RESULTS : results,
    hasMore: !isQueryTooShort && hasMore,
    isSearching: isWaitingForDebounce || (!isQueryTooShort && isSearching),
    error: isQueryTooShort ? null : error,
    fetchMore,
  };
};
