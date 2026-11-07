export type MangaReadingStatus =
  | "to_read"
  | "reading"
  | "completed"
  | "dropped";

// Suivi d'un manga : en chapitres (numérique) ou en tomes (papier). Enum ProgressUnit côté back.
export type ProgressUnit = "chapter" | "volume";

export interface MangaLibraryStatus {
  isInLibrary: boolean;
  readingStatus: MangaReadingStatus | null;
  readingStatusLabel: string | null;
}

// Où en est l'utilisateur ; tout est null quand le manga n'est pas dans sa liste.
// Les deux numéros sont gardés : le format choisi dit lequel est affiché et avancé par le +1.
export interface MangaReadingProgress {
  progressUnit: ProgressUnit | null;
  lastReadChapter: number | null;
  lastReadVolume: number | null;
}

// Tout ce que l'utilisateur a enregistré pour un manga : statut et progression.
export type MangaEntrySnapshot = MangaLibraryStatus & MangaReadingProgress;

export interface MangaEntryPayload {
  providerId: string;
  status: MangaReadingStatus;
  // Facultatifs : absents, la progression enregistrée ne change pas.
  progressUnit?: ProgressUnit;
  lastReadChapter?: number | null;
  lastReadVolume?: number | null;
}

// Réponse du +1 (POST /manga_entries/{id}/advance).
export interface MangaAdvanceResponse extends MangaReadingProgress {
  readingStatus: MangaReadingStatus;
  readingStatusLabel: string;
  progressUnit: ProgressUnit;
}

// MangaShortDTO côté back.
export interface MangaShortResponse extends MangaLibraryStatus, MangaReadingProgress {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

// MangaCompleteDTO côté back (fiche, bibliothèque).
export interface MangaCompleteResponse extends MangaLibraryStatus, MangaReadingProgress {
  id: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string;
  genres: string[];
  themes: string[];
  numberOfVolumes: string;
  numberOfChapters: string;
  publicationStatus: string;
  publicationYear: string;
  // La série est finie chez MangaDex ; son dernier chapitre / tome quand MangaDex le connaît.
  isSeriesCompleted: boolean;
  finalChapter: number | null;
  finalVolume: number | null;
  // Dernier chapitre paru en français sur MangaDex : seulement sur la fiche et dans
  // « à reprendre », pour un manga suivi en chapitres.
  latestFrenchChapter: number | null;
}
