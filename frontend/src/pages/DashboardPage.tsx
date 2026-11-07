import {
  BarChart3,
  CalendarClock,
  Gamepad2,
  History,
  Library,
  PlayCircle,
  Plus,
} from "lucide-react";
import PageHeader from "../shared/components/PageHeader";
import ButtonLink from "../shared/components/Button/ButtonLink";
import DashboardSection from "../features/dashboard/components/DashboardSection";
import InProgressShelf from "../features/dashboard/components/InProgressShelf";
import ReadingMangaShelf from "../features/dashboard/components/ReadingMangaShelf";
import CollectionOverviewCard, {
  CollectionOverviewSkeleton,
  type StatusSegment,
} from "../features/dashboard/components/CollectionOverviewCard";
import RecentActivityList from "../features/dashboard/components/RecentActivityList";
import UpcomingGamesList from "../features/dashboard/components/UpcomingGamesList";
import { useLibraryStats } from "../features/library/hooks/useLibraryStats";
import { useRecentEntries } from "../features/library/hooks/useRecentEntries";
import { useGameLibrary } from "../features/game/hooks/useGameLibrary";
import { useUpcomingGames } from "../features/game/hooks/useUpcomingGames";
import { mangaReadingStatusLabels } from "../features/manga/mangaReadingStatus";
import { gameStatusLabels } from "../features/game/gameStatus";
import type { CollectionStats } from "../features/library/types";

// Statuts dans l'ordre des libellés (à faire, en cours, terminé, abandonné).
const toSegments = <Status extends StatusSegment["status"]>(
  labels: Record<Status, string>,
  stats: CollectionStats<Status>,
): StatusSegment[] =>
  (Object.keys(labels) as Status[]).map((status) => ({
    status,
    label: labels[status],
    count: stats.byStatus[status] ?? 0,
  }));

// Page d'accueil, par ordre d'utilité : reprendre ce qui est en cours, ajouter,
// voir sa collection d'un coup d'œil, puis l'activité et les sorties à venir.
const DashboardPage = () => {
  const stats = useLibraryStats();
  const playingGames = useGameLibrary("playing");
  const recentEntries = useRecentEntries();
  const upcomingGames = useUpcomingGames();

  return (
    <div className="space-y-10">
      <PageHeader
        title="Accueil"
        description="Reprenez où vous en étiez et gardez un œil sur votre collection."
        action={
          <>
            <ButtonLink to="/search?tab=mangas" variant="tonal" size="sm">
              <Plus className="h-4 w-4" />
              Ajouter un manga
            </ButtonLink>
            <ButtonLink to="/search?tab=games" variant="tonal" size="sm">
              <Plus className="h-4 w-4" />
              Ajouter un jeu
            </ButtonLink>
          </>
        }
      />

      <DashboardSection
        title="En cours"
        icon={<PlayCircle className="h-5 w-5 text-indigo-500" />}
      >
        <div className="space-y-6">
          <ReadingMangaShelf
            readingCount={stats.data?.mangas.byStatus.reading ?? null}
          />
          <InProgressShelf
            title="Jeux"
            icon={<Gamepad2 className="h-4 w-4" />}
            count={stats.data?.games.byStatus.playing ?? null}
            items={playingGames.items.map((game) => ({
              key: String(game.id),
              title: game.title,
              coverUrl: game.coverUrl,
              href: `/game/${game.id}`,
            }))}
            loading={playingGames.loading}
            error={playingGames.error}
            seeAllHref="/games?status=playing"
            emptyMessage="Aucun jeu en cours."
            emptyAction={{ label: "Trouver un jeu", href: "/search?tab=games" }}
            placeholderIcon={<Gamepad2 className="h-8 w-8" />}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Ma collection"
        icon={<BarChart3 className="h-5 w-5 text-indigo-500" />}
      >
        {stats.error ? (
          <p className="text-sm text-red-400">{stats.error}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {stats.data ? (
              <>
                <CollectionOverviewCard
                  title="Mangas"
                  icon={<Library className="h-4 w-4" />}
                  libraryHref="/mangas"
                  total={stats.data.mangas.total}
                  segments={toSegments(mangaReadingStatusLabels, stats.data.mangas)}
                />
                <CollectionOverviewCard
                  title="Jeux"
                  icon={<Gamepad2 className="h-4 w-4" />}
                  libraryHref="/games"
                  total={stats.data.games.total}
                  segments={toSegments(gameStatusLabels, stats.data.games)}
                />
              </>
            ) : (
              <>
                <CollectionOverviewSkeleton />
                <CollectionOverviewSkeleton />
              </>
            )}
          </div>
        )}
      </DashboardSection>

      <div className="grid gap-10 xl:grid-cols-2">
        <DashboardSection
          title="Dernières modifications"
          icon={<History className="h-5 w-5 text-indigo-500" />}
        >
          <RecentActivityList
            entries={recentEntries.data ?? []}
            loading={recentEntries.loading}
            error={recentEntries.error}
          />
        </DashboardSection>

        <DashboardSection
          title="Jeux à venir"
          icon={<CalendarClock className="h-5 w-5 text-indigo-500" />}
        >
          <UpcomingGamesList
            games={upcomingGames.data ?? []}
            loading={upcomingGames.loading}
            error={upcomingGames.error}
          />
        </DashboardSection>
      </div>
    </div>
  );
};

export default DashboardPage;
