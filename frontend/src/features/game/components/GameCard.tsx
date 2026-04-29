import type { GameResponse } from "../types";

interface GameCardProps {
  game: GameResponse;
}

export const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="text-center p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
      <h3 className="text-xl font-bold mb-2">{game.name}</h3>
      <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
        {game.summary}
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
        <p className="px-2 py-1 bg-zinc-800 rounded text-zinc-300">
          Note: <span className="font-bold text-emerald-400">{Math.round(game.rating)}%</span>
        </p>
        <p className="px-2 py-1 bg-zinc-800 rounded text-zinc-300">
          Plateformes: {game.platforms?.length || 0}
        </p>
      </div>

      {game.cover?.image_id && (
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`}
          alt={`Couverture de ${game.name}`}
          className="m-auto rounded shadow-lg max-h-64 object-cover"
        />
      )}
    </div>
  );
};
