import { useState } from "react";
import { useNavigate } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMangaSearch } from "../hooks/useMangaSearch";
import StatusBadge from "./StatusBadge/StatusBadge";

const MANGA_SEARCH_SCROLL_TARGET_ID = "manga-search-results";

export const MangaSearch = () => {
  const navigate = useNavigate();

  const { query, setQuery, results, fetchMore, hasMore } = useMangaSearch();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    navigate(`/manga/${id}`);
    setIsOpen(false);
  };

  return (
    <div className="relative mx-auto mb-8 w-full max-w-sm">
      <input
        type="text"
        placeholder="Rechercher un manga..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      {isOpen && results.length > 0 && (
        <div
          id={MANGA_SEARCH_SCROLL_TARGET_ID}
          className="absolute right-0 left-0 z-20 mt-2 h-72 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl"
        >
          <InfiniteScroll
            dataLength={results.length}
            next={fetchMore}
            hasMore={hasMore}
            scrollableTarget={MANGA_SEARCH_SCROLL_TARGET_ID}
            loader={
              <div className="flex animate-pulse gap-3 bg-zinc-900/50 px-4 pt-4 pb-3">
                <div className="flex flex-1 flex-col justify-center space-y-2">
                  <div className="h-4 w-3/4 rounded bg-zinc-800"></div>
                  <div className="h-3 w-1/3 rounded bg-zinc-800"></div>
                </div>
              </div>
            }
            endMessage={
              <p className="py-4 text-center text-zinc-500">
                Tous les mangas sont chargés.
              </p>
            }
          >
            <ul className="flex w-full flex-col">
              {results.map((item) => (
                <li key={item.id} className="border-b border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className="w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-zinc-800"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.title}</p>
                        <p className="truncate text-xs text-zinc-500">
                          {item.author}
                        </p>
                      </div>

                      {item.readingStatus && item.readingStatusLabel && (
                        <StatusBadge
                          label={item.readingStatusLabel}
                          status={item.readingStatus}
                        />
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
