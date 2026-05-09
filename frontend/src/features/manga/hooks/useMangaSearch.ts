import { useCallback, useEffect, useRef, useState } from "react";
import { getAutocompleteManga } from "../api";
import type { MangaShortResponse } from "../types";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { MANGA_SEARCH_LIMIT } from "../constants";

export const useMangaSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MangaShortResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const debouncedQuery = useDebounce(query, 200);

  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  const currentQueryRef = useRef("");

  useEffect(() => {
    const cleanQuery = debouncedQuery.trim();
    const requestId = requestIdRef.current + 1;

    requestIdRef.current = requestId;
    currentQueryRef.current = cleanQuery;

    if (cleanQuery.length < 2) {
      setResults([]);
      setHasMore(false);
      setIsSearching(false);
      pageRef.current = 0;
      isFetchingRef.current = false;
      return;
    }

    const fetchFirstPage = async () => {
      isFetchingRef.current = true;
      setIsSearching(true);

      try {
        const data = await getAutocompleteManga(cleanQuery, 0);

        if (requestId !== requestIdRef.current) {
          return;
        }

        setResults(data);
        pageRef.current = 1;
        setHasMore(data.length === MANGA_SEARCH_LIMIT);
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.error("Error fetching autocomplete results:", error);
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
      const data = await getAutocompleteManga(cleanQuery, nextPage);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setResults((prev) => [...prev, ...data]);
      pageRef.current = nextPage + 1;
      setHasMore(data.length === MANGA_SEARCH_LIMIT);
    } catch (error) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      console.error("Error fetching more autocomplete results:", error);
      setHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        isFetchingRef.current = false;
        setIsSearching(false);
      }
    }
  }, [hasMore]);

  return {
    query,
    setQuery,
    results,
    hasMore,
    isSearching,
    fetchMore,
  };
};
