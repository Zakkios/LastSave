import type { GameShortResponse } from "../types";
import { Star, Gamepad2 } from "lucide-react";

interface GameCardProps {
  game: GameShortResponse;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <article className="w-full p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
      <div className="flex justify-between">
        <div className="flex gap-3">
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
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {game.rating && (
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
              <Star className="h-3 w-3 fill-current" />
              {Math.round(game.rating)}%
            </div>
          )}
          {game.statusLabel && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-300 uppercase">
              {game.statusLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
