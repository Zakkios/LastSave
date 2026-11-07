import type { GameStatus } from "../types";

// Mêmes couleurs que les statuts manga (StatusBadge) : à faire, en cours, terminé, abandonné.
const gameStatusBadges: Record<GameStatus, string> = {
  to_play: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
  playing: "border border-violet-500/30 bg-violet-500/10 text-violet-300",
  completed: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  dropped: "border border-rose-500/30 bg-rose-500/10 text-rose-300",
};

interface GameStatusBadgeProps {
  status: GameStatus;
  label: string;
}

const GameStatusBadge = ({ status, label }: GameStatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${gameStatusBadges[status]}`}
    >
      {label}
    </span>
  );
};

export default GameStatusBadge;
