import type { StatusVariant } from "../../shared/components/StatusBadge/statusBadge.types";

export interface MangaCompleteResponse {
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
  isInLibrary: boolean;
  readingStatus: StatusVariant | null;
  readingStatusLabel: string | null;
}

export interface MangaShortResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  isInLibrary: boolean;
  readingStatus: StatusVariant | null;
  readingStatusLabel: string | null;
}
