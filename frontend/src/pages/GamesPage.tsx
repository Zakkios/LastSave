import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Filter, Gamepad2, Loader2, Search } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import PageHeader from "../shared/components/PageHeader";
import EmptyState from "../shared/components/EmptyState";
import Button from "../shared/components/Button/Button";
import { useGameLibrary } from "../features/game/hooks/useGameLibrary";
import { GamePreviewCard } from "../features/game/components/GamePreviewCard";
import { gameStatusOptions, isGameStatus } from "../features/game/gameStatus";
import type { GameStatus } from "../features/game/types";

const GameGridSkeleton = () => (
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

const GamesPage = () => {
  const navigate = useNavigate();
  const { items, loading, hasMore, error, fetchMore } = useGameLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<GameStatus | "all">("all");

  // Filtre sur les jeux déjà chargés (comme pour les mangas).
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.playStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(isGameStatus(value) ? value : "all");
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
        title="Mes jeux"
        description="Gérez votre collection de jeux vidéo."
        action={
          <Link to="/search">
            <Button variant="primary">Ajouter un jeu</Button>
          </Link>
        }
      />

      {hasNoData ? (
        <EmptyState
          icon={<Gamepad2 className="h-6 w-6 text-zinc-400" />}
          title={
            error ? "Bibliothèque indisponible" : "Votre bibliothèque est vide"
          }
          description={
            error
              ? "Impossible de charger vos jeux pour le moment. Réessayez dans quelques instants."
              : "Commencez par rechercher des jeux pour les ajouter à votre collection."
          }
          action={
            <Link to="/search">
              <Button variant="ghost">Rechercher des jeux</Button>
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
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">Tous les statuts</option>
                {gameStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Liste des résultats filtrés */}
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              Aucun jeu ne correspond à vos filtres.
            </div>
          ) : (
            <InfiniteScroll
              dataLength={items.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<GameGridSkeleton />}
              endMessage={
                items.length > 0 &&
                !error && (
                  <p className="py-8 text-center text-sm text-zinc-500">
                    Vous avez fait le tour de la ludothèque.
                  </p>
                )
              }
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => navigate(`/game/${game.id}`)}
                    className="w-full cursor-pointer text-left"
                  >
                    <GamePreviewCard game={game} />
                  </button>
                ))}
              </div>
            </InfiniteScroll>
          )}

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GamesPage;
