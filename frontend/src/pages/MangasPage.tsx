import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { Library, Search, Filter, Loader2 } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import PageHeader from "../shared/components/PageHeader";
import EmptyState from "../shared/components/EmptyState";
import { useMangaLibrary } from "../features/manga/hooks/useMangaLibrary";
import { MangaPreviewCard } from "../features/manga/components/MangaPreviewCard";
import Button from "../shared/components/Button/Button";
import type { MangaReadingStatus } from "../features/manga/types";

const MangaGridSkeleton = () => (
  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
    <div className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 animate-pulse">
      <div className="h-24 w-16 shrink-0 rounded bg-zinc-800" />

      <div className="flex flex-1 flex-col justify-center space-y-2">
        <div className="h-4 w-3/4 rounded bg-zinc-800" />
        <div className="h-3 w-1/2 rounded bg-zinc-800" />
      </div>
    </div>
  </div>
);

const MangasPage = () => {
  const navigate = useNavigate();
  const { items, loading, hasMore, error, fetchMore } = useMangaLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<MangaReadingStatus | "all">(
    "all",
  );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.readingStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const handleMangaClick = (id: string) => {
    navigate(`/manga/${id}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const hasNoData = items.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ma bibliothèque"
        description="Gérez votre collection personnelle de mangas."
        action={
          <Link to="/search">
            <Button variant="primary">Ajouter un manga</Button>
          </Link>
        }
      />

      {hasNoData ? (
        <EmptyState
          icon={<Library className="h-6 w-6 text-zinc-400" />}
          title={
            error ? "Bibliothèque indisponible" : "Votre bibliothèque est vide"
          }
          description={
            error
              ? "L'accès à votre bibliothèque est temporairement indisponible. Le backend doit être configuré."
              : "Commencez par rechercher des mangas pour les ajouter à votre collection."
          }
          action={
            <Link to="/search">
              <Button variant="ghost">Rechercher des mangas</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Barre de recherche locale et filtres */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Filtrer par titre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-zinc-50 outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="h-4 w-4 text-zinc-500 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as MangaReadingStatus | "all")
                }
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="reading">En cours</option>
                <option value="to_read">À lire</option>
                <option value="completed">Terminé</option>
                <option value="dropped">Abandonné</option>
              </select>
            </div>
          </div>

          {/* Liste des résultats filtrés */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              Aucun manga ne correspond à vos filtres.
            </div>
          ) : (
            <InfiniteScroll
              dataLength={items.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<MangaGridSkeleton />}
              endMessage={
                items.length > 0 && (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    Vous avez parcouru toute l’étagère.
                  </p>
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((manga) => (
                  <button
                    key={manga.id}
                    onClick={() => handleMangaClick(manga.id)}
                    className="w-full text-left"
                  >
                    <MangaPreviewCard manga={manga} />
                  </button>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      )}
    </div>
  );
};

export default MangasPage;
