export type MangaReadingStatus =
  | "to_read"
  | "reading"
  | "completed"
  | "dropped";

export interface MangaLibraryStatus {
  isInLibrary: boolean;
  readingStatus: MangaReadingStatus | null;
  readingStatusLabel: string | null;
}

export interface MangaEntryPayload {
  providerId: string;
  status: MangaReadingStatus;
}

export interface MangaShortResponse extends MangaLibraryStatus {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

export interface MangaCompleteResponse extends MangaLibraryStatus {
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
}
