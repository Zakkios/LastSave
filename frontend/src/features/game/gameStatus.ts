import type { GameStatus } from "./types";

// Mêmes libellés que GameStatus::label() côté back.
export const gameStatusLabels: Record<GameStatus, string> = {
  to_play: "À jouer",
  playing: "En cours",
  completed: "Terminé",
  dropped: "Abandonné",
};

export const gameStatusOptions = Object.entries(gameStatusLabels).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const getGameStatusLabel = (status: GameStatus): string => {
  return gameStatusLabels[status];
};

export const isGameStatus = (value: string): value is GameStatus => {
  return Object.hasOwn(gameStatusLabels, value);
};
