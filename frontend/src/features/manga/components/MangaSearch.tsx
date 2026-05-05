import { useState } from "react";
import { useNavigate } from "react-router";
import { useMangaSearch } from "../hooks/useMangaSearch";
import InfiniteScroll from "react-infinite-scroll-component";

export const MangaSearch = () => {
  const navigate = useNavigate();

  const { query, setQuery, results, fetchMore, hasMore } = useMangaSearch();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    navigate(`/manga/${id}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto mb-8">
      <input
        type="text"
        placeholder="Rechercher un manga..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 h-52 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-y-scroll">
          <InfiniteScroll
            dataLength={results.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="animate-pulse flex flex-col items-center space-y-4 px-8 py-3">
                <div className="h-8 w-full bg-zinc-800 rounded"></div>
              </div>
            }
            endMessage={
              <p className="text-zinc-500 text-center py-4">
                Tous les mangas sont chargés.
              </p>
            }
          >
            <div className="w-full max-w-2xl flex flex-col gap-3">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-800 last:border-0"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-zinc-500">{item.author}</p>
                </li>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};
