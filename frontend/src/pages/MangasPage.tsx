import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Library, Search, Filter, Loader2, Plus } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import PageHeader from "../shared/components/PageHeader";
import EmptyState from "../shared/components/EmptyState";
import { useMangaLibrary } from "../features/manga/hooks/useMangaLibrary";
import { MangaPreviewCard } from "../features/manga/components/MangaPreviewCard";
import ButtonLink from "../shared/components/Button/ButtonLink";
import {
  isMangaReadingStatus,
  mangaReadingStatusOptions,
} from "../features/manga/mangaReadingStatus";

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
  // Le statut filtré est dans l'adresse (/mangas?status=reading) : l'accueil
  // peut ainsi ouvrir la bibliothèque déjà filtrée. Le filtre est fait par le back.
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status") ?? "";
  const statusFilter = isMangaReadingStatus(statusParam) ? statusParam : null;

  const { items, loading, hasMore, error, fetchMore } =
    useMangaLibrary(statusFilter);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtre par titre : sur les mangas déjà chargés seulement.
  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return items.filter((item) => item.title.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const handleStatusFilterChange = (value: string) => {
    setSearchParams(isMangaReadingStatus(value) ? { status: value } : {}, {
      replace: true,
    });
  };

  const handleMangaClick = (id: string) => {
    navigate(`/manga/${id}`);
  };

  // Bibliothèque vraiment vide (et non vide pour le statut choisi).
  const isLibraryEmpty =
    !loading && !error && statusFilter === null && items.length === 0;

  const renderList = () => {
    if (loading) {
      return (
        <div className="flex min-h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      );
    }

    if (error && items.length === 0) {
      return (
        <EmptyState
          icon={<Library className="h-6 w-6 text-zinc-400" />}
          title="Bibliothèque indisponible"
          description="Impossible de charger vos mangas pour le moment. Réessayez dans quelques instants."
        />
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="py-12 text-center text-zinc-500">
          {items.length === 0
            ? "Aucun manga avec ce statut."
            : "Aucun manga ne correspond à vos filtres."}
        </div>
      );
    }

    return (
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<MangaGridSkeleton />}
        endMessage={
          items.length > 0 &&
          !error && (
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
              type="button"
              onClick={() => handleMangaClick(manga.id)}
              className="w-full cursor-pointer text-left"
            >
              <MangaPreviewCard manga={manga} />
            </button>
          ))}
        </div>
      </InfiniteScroll>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ma bibliothèque"
        description="Gérez votre collection personnelle de mangas."
        action={
          <ButtonLink to="/search?tab=mangas" variant="tonal" size="sm">
            <Plus className="h-4 w-4" />
            Ajouter un manga
          </ButtonLink>
        }
      />

      {isLibraryEmpty ? (
        <EmptyState
          icon={<Library className="h-6 w-6 text-zinc-400" />}
          title="Votre bibliothèque est vide"
          description="Commencez par rechercher des mangas pour les ajouter à votre collection."
          action={
            <ButtonLink to="/search?tab=mangas" variant="secondary">
              Rechercher des mangas
            </ButtonLink>
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
                value={statusFilter ?? "all"}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                {mangaReadingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {renderList()}

          {error && items.length > 0 && (
            <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MangasPage;
