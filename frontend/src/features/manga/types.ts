export interface MangaResponse {
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
