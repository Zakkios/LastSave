export type GameStatus =
  | "backlog"
  | "playing"
  | "completed"
  | "retired"
  | "abandoned";

export interface GameLibraryStatus {
  isInLibrary: boolean;
  status: GameStatus | null;
  statusLabel: string | null;
}

export interface GameShortResponse extends GameLibraryStatus {
  id: string;
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

// Deprecated or old type for compatibility if needed, but we should migrate
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
