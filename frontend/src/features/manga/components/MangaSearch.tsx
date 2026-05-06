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
        <div className="absolute left-0 right-0 mt-2 h-72 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-y-scroll">
          <InfiniteScroll
            dataLength={results.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="flex gap-3 px-4 pt-4 pb-3 bg-zinc-900/50 animate-pulse">
                <div className="flex flex-col justify-center flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                  <div className="h-3 w-1/3 bg-zinc-800 rounded"></div>
                </div>
              </div>
            }
            endMessage={
              <p className="text-zinc-500 text-center py-4">
                Tous les mangas sont chargés.
              </p>
            }
          >
            <div className="w-full max-w-2xl flex flex-col">
              {results.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-800"
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
