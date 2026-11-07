import type { GameStatus } from "../game/types";
import type { MangaReadingStatus } from "../manga/types";

// Bibliothèque entière (mangas et jeux), pour la page d'accueil.

export interface CollectionStats<Status extends string> {
  total: number;
  // Tous les statuts sont présents, à 0 s'ils ne sont pas utilisés.
  byStatus: Record<Status, number>;
}

// GET /library/stats
export interface LibraryStats {
  mangas: CollectionStats<MangaReadingStatus>;
  games: CollectionStats<GameStatus>;
}

interface RecentEntryBase {
  title: string;
  coverUrl: string | null;
  statusLabel: string;
  // « added » : nouvelle entrée ; « updated » : statut changé depuis l'ajout.
  action: "added" | "updated";
  // Date ISO 8601 du dernier changement.
  updatedAt: string;
}

// RecentEntryDTO côté back (GET /library/recent).
export type RecentEntry =
  | (RecentEntryBase & { type: "manga"; id: string; status: MangaReadingStatus })
  | (RecentEntryBase & { type: "game"; id: number; status: GameStatus });
