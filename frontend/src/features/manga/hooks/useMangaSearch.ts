import { useEffect, useState } from "react";
import { getAutocompleteManga } from "../api";
import type { MangaCompleteResponse } from "../types";
import { useDebounce } from "../../../shared/hooks/useDebounce";

export const useMangaSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MangaCompleteResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    const searchManga = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const data = await getAutocompleteManga(debouncedQuery);
        setResults(data);
      } catch (error) {
        console.error("Error fetching autocomplete results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    void searchManga();
  }, [debouncedQuery]);

  return { query, setQuery, results, isSearching };
};
