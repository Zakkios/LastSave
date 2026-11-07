// Mêmes valeurs que l'enum GameStatus du back (parallèle des statuts manga).
export type GameStatus = "to_play" | "playing" | "completed" | "dropped";

// Mêmes noms de champs que côté manga (readingStatus → playStatus).
export interface GameLibraryStatus {
  isInLibrary: boolean;
  playStatus: GameStatus | null;
  playStatusLabel: string | null;
}

export interface GameEntryPayload {
  // Identifiant IGDB du jeu.
  providerId: number;
  status: GameStatus;
}

// GameShortDTO côté back.
export interface GameShortResponse extends GameLibraryStatus {
  // Identifiant IGDB : un entier.
  id: number;
  title: string;
  developer: string | null;
  coverUrl: string | null;
  // Note IGDB de 0 à 100.
  rating: number | null;
  platforms: string[];
}

// GameCompleteDTO côté back.
export interface GameCompleteResponse extends GameShortResponse {
  summary: string | null;
  releaseYear: string | null;
  genres: string[];
  themes: string[];
}
