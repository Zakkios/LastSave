import { useEffect, useState } from "react";
import { getAutocompleteManga } from "../api";
import type { MangaShortResponse } from "../types";
import { useDebounce } from "../../../shared/hooks/useDebounce";

const LIMIT = 8;

export const useMangaSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MangaShortResponse[]>([]);
  const [page, setPage] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const fetchFirstPage = async () => {
      const cleanQuery = debouncedQuery.trim();

      if (cleanQuery.length < 2) {
        setResults([]);
        setPage(0);
        setHasMore(false);
        return;
      }

      setIsSearching(true);

      try {
        const data = await getAutocompleteManga(cleanQuery, 0);

        setResults(data);
        setPage(1);
        setHasMore(data.length === LIMIT);
      } catch (error) {
        console.error("Error fetching autocomplete results:", error);
        setResults([]);
        setHasMore(false);
      } finally {
        setIsSearching(false);
      }
    };

    void fetchFirstPage();
  }, [debouncedQuery]);

  const fetchMore = async () => {
    if (isSearching || !hasMore) {
      return;
    }

    const cleanQuery = debouncedQuery.trim();

    if (cleanQuery.length < 2) {
      return;
    }

    setIsSearching(true);

    try {
      const data = await getAutocompleteManga(cleanQuery, page);

      setResults((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error("Error fetching more autocomplete results:", error);
      setHasMore(false);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    hasMore,
    fetchMore,
  };
};
