// Mêmes valeurs que l'enum GameStatus du back (parallèle des statuts manga).
export type GameStatus = "to_play" | "playing" | "completed" | "dropped";

// Mêmes noms de champs que côté manga (readingStatus → playStatus).
export interface GameLibraryStatus {
  isInLibrary: boolean;
  playStatus: GameStatus | null;
  playStatusLabel: string | null;
}

export interface GameShortResponse extends GameLibraryStatus {
  // Identifiant IGDB : un entier.
  id: number;
  title: string;
  developer?: string;
  coverUrl?: string;
  rating?: number;
  platforms?: string[];
}

export interface GameCompleteResponse extends GameShortResponse {
  summary: string;
  releaseYear?: string;
  genres?: string[];
  themes?: string[];
}

// Réponse brute de GET /api/game/random (le sort de cette route reste à décider).
export interface GameResponse {
  name: string;
  summary: string;
  platforms: number[];
  rating: number;
  cover: {
    id: number;
    image_id: string;
  };
}
