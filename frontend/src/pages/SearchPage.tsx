import { useState } from "react";
import { useNavigate } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Search, Library, Gamepad2, Loader2 } from "lucide-react";
import { useMangaSearch } from "../features/manga/hooks/useMangaSearch";
import { MangaPreviewCard } from "../features/manga/components/MangaPreviewCard";
import PageHeader from "../shared/components/PageHeader";
import EmptyState from "../shared/components/EmptyState";

type SearchTab = "mangas" | "games";

const SearchPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchTab>("mangas");
  const { query, setQuery, results, fetchMore, hasMore, isSearching, error } = useMangaSearch();

  const handleClickPreviewCard = (id: string) => {
    navigate(`/manga/${id}`);
  };

  const isEmpty = !isSearching && query.trim().length >= 2 && results.length === 0;
  const isInitial = query.trim().length < 2;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        title="Recherche" 
        description="Trouvez vos œuvres préférées sur toutes les plateformes."
      />

      {/* Barre de recherche principale */}
      <div className="relative w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-zinc-500" />
          )}
        </div>
        <input
          type="text"
          placeholder="Rechercher un titre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-zinc-50 transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Onglets */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("mangas")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "mangas"
              ? "border-indigo-500 text-indigo-500"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Library className="h-4 w-4" />
          Mangas
        </button>
        <button
          onClick={() => setActiveTab("games")}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "games"
              ? "border-indigo-500 text-indigo-500"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Gamepad2 className="h-4 w-4" />
          Jeux
        </button>
      </div>

      {/* Contenu de la recherche */}
      <div className="mt-2">
        {activeTab === "mangas" ? (
          <>
            {isInitial ? (
              <EmptyState
                icon={<Search className="h-6 w-6 text-zinc-500" />}
                title="Prêt à chercher ?"
                description="Entrez au moins 2 caractères pour lancer une recherche sur MangaDex."
              />
            ) : isEmpty ? (
              <EmptyState
                icon={<Search className="h-6 w-6 text-zinc-500" />}
                title="Aucun résultat"
                description={`Nous n'avons trouvé aucun manga correspondant à "${query}".`}
              />
            ) : (
              <InfiniteScroll
                dataLength={results.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={
                  <div className="w-full max-w-2xl flex mt-3 gap-3 p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 animate-pulse">
                    <div className="w-16 h-24 shrink-0 rounded bg-zinc-800"></div>
                    <div className="flex flex-col justify-center flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                      <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                }
                endMessage={
                  results.length > 0 && (
                    <p className="py-8 text-center text-sm text-zinc-500">
                      Fin des résultats MangaDex.
                    </p>
                  )
                }
              >
                <div className="flex w-full max-w-2xl flex-col gap-3">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full cursor-pointer text-left"
                      onClick={() => handleClickPreviewCard(item.id)}
                    >
                      <MangaPreviewCard manga={item} />
                    </button>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </>
        ) : (
          <EmptyState
            icon={<Gamepad2 className="h-6 w-6 text-zinc-500" />}
            title="Recherche de jeux"
            description="L'intégration avec IGDB arrive très prochainement. Restez à l'écoute !"
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
