import { Link } from "react-router";
import { Gamepad2 } from "lucide-react";
import { Card } from "../../../shared/components/Card/Card";
import type { GameShortResponse } from "../../game/types";
import {
  formatRelativeDate,
  formatReleaseDate,
  parseReleaseDate,
} from "../../../shared/utils/formatDate";

interface UpcomingGamesListProps {
  games: GameShortResponse[];
  loading: boolean;
  error: string | null;
}

const MAX_VISIBLE_PLATFORMS = 3;

// Jeux de la bibliothèque dont la sortie annoncée est à venir (données IGDB).
const UpcomingGamesList = ({ games, loading, error }: UpcomingGamesListProps) => {
  if (loading) {
    return (
      <Card className="divide-y divide-zinc-800">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="flex animate-pulse gap-3 p-3">
            <div className="h-14 w-10 shrink-0 rounded bg-zinc-800" />
            <div className="flex flex-1 flex-col justify-center gap-2">
              <div className="h-3 w-2/3 rounded bg-zinc-800" />
              <div className="h-3 w-1/4 rounded bg-zinc-800" />
            </div>
          </div>
        ))}
      </Card>
    );
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (games.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-5 text-sm text-zinc-500">
        Aucun jeu de votre liste n'a de date de sortie annoncée pour le moment.
      </p>
    );
  }

  const now = new Date();

  return (
    <Card className="divide-y divide-zinc-800">
      {games.map((game) => (
        <Link
          key={game.id}
          to={`/game/${game.id}`}
          className="flex items-center gap-3 p-3 transition-colors hover:bg-zinc-900"
        >
          <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-800">
            {game.coverUrl ? (
              <img
                src={game.coverUrl}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <Gamepad2 className="h-5 w-5 text-zinc-600" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-100">
              {game.title}
            </p>
            {game.platforms.length > 0 && (
              <p className="mt-1 truncate text-xs text-zinc-500">
                {game.platforms.slice(0, MAX_VISIBLE_PLATFORMS).join(" · ")}
                {game.platforms.length > MAX_VISIBLE_PLATFORMS &&
                  ` +${game.platforms.length - MAX_VISIBLE_PLATFORMS}`}
              </p>
            )}
          </div>

          {game.releaseDate && (
            <div className="shrink-0 text-right">
              <time
                dateTime={game.releaseDate}
                className="block text-sm font-medium text-zinc-200"
              >
                {formatReleaseDate(game.releaseDate)}
              </time>
              <span className="text-xs text-zinc-500">
                {formatRelativeDate(parseReleaseDate(game.releaseDate), now)}
              </span>
            </div>
          )}
        </Link>
      ))}
    </Card>
  );
};

export default UpcomingGamesList;
