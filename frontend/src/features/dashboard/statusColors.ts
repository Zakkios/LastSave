import type { GameStatus } from "../game/types";
import type { MangaReadingStatus } from "../manga/types";

// Couleurs pleines (barres, pastilles), dans la même teinte que les badges de statut :
// à faire (bleu ciel), en cours (violet), terminé (vert), abandonné (rose).
export const statusFillColors: Record<MangaReadingStatus | GameStatus, string> = {
  to_read: "bg-sky-500",
  to_play: "bg-sky-500",
  reading: "bg-violet-500",
  playing: "bg-violet-500",
  completed: "bg-emerald-500",
  dropped: "bg-rose-500",
};
