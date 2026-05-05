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
}

export interface MangaShortResponse {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}
