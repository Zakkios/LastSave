import type { GameShortResponse } from "../types";
import { Star, Gamepad2 } from "lucide-react";
import GameStatusBadge from "./GameStatusBadge";

interface GamePreviewCardProps {
  game: GameShortResponse;
}

// Au-delà, les plateformes sont résumées par « +N » pour garder la carte compacte.
const MAX_VISIBLE_PLATFORMS = 4;

export const GamePreviewCard = ({ game }: GamePreviewCardProps) => {
  const visiblePlatforms = game.platforms.slice(0, MAX_VISIBLE_PLATFORMS);
  const hiddenPlatformsCount = game.platforms.length - visiblePlatforms.length;

  return (
    <article className="w-full p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
      <div className="flex justify-between gap-3">
        <div className="flex gap-3 min-w-0">
          <div className="w-16 h-24 shrink-0 overflow-hidden rounded bg-zinc-800 flex items-center justify-center">
            {game.coverUrl ? (
              <img
                src={game.coverUrl}
                alt={`Couverture de ${game.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Gamepad2 className="h-8 w-8 text-zinc-700" />
            )}
          </div>

          <div className="flex flex-col justify-center min-w-0 text-left">
            <h3 className="text-base font-bold text-zinc-100 mb-1 line-clamp-2 wrap-break-word">
              {game.title}
            </h3>

            <p className="text-zinc-400 text-sm truncate">
              {game.developer || "Développeur inconnu"}
            </p>

            {visiblePlatforms.length > 0 && (
              <p className="mt-1 text-xs text-zinc-500 truncate">
                {visiblePlatforms.join(" · ")}
                {hiddenPlatformsCount > 0 && ` +${hiddenPlatformsCount}`}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {game.rating !== null && (
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
              <Star className="h-3 w-3 fill-current" />
              {game.rating}%
            </div>
          )}
          {game.playStatus && game.playStatusLabel && (
            <GameStatusBadge
              status={game.playStatus}
              label={game.playStatusLabel}
            />
          )}
        </div>
      </div>
    </article>
  );
};
