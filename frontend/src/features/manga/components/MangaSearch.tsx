import { useState } from "react";
import { useNavigate } from "react-router";
import { useMangaSearch } from "../hooks/useMangaSearch";

export const MangaSearch = () => {
  const navigate = useNavigate();
  const { query, setQuery, results } = useMangaSearch();
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
        <ul className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden">
          {results.map((manga) => (
            <li
              key={manga.id}
              onClick={() => handleSelect(manga.id)}
              className="px-4 py-3 hover:bg-zinc-800 cursor-pointer transition-colors border-b border-zinc-800 last:border-0"
            >
              <p className="font-medium">{manga.title}</p>
              <p className="text-xs text-zinc-500">{manga.author}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
