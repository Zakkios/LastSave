import type {
  MangaCompleteResponse,
  MangaEntrySnapshot,
  MangaReadingProgress,
  MangaReadingStatus,
} from "./types";

// « 1094,5 » : virgule française, pas de séparateur de milliers (« 1194 », pas « 1 194 »).
const chapterFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  useGrouping: false,
});

export const formatChapterNumber = (chapter: number): string =>
  chapterFormatter.format(chapter);

// Numéro suivi : le dernier chapitre ou le dernier tome lu, selon le format choisi.
export const getProgressValue = (progress: MangaReadingProgress): number | null =>
  progress.progressUnit === "volume"
    ? progress.lastReadVolume
    : progress.lastReadChapter;

// « Chap. 1194 », « Tome 12 » ; null tant qu'aucun numéro n'est saisi.
export const formatProgress = (progress: MangaReadingProgress): string | null => {
  const value = getProgressValue(progress);

  if (progress.progressUnit === null || value === null) {
    return null;
  }

  return progress.progressUnit === "volume"
    ? `Tome ${value}`
    : `Chap. ${formatChapterNumber(value)}`;
};

// Le +1 n'a de sens que pour un manga à lire ou en cours.
export const canAdvance = (status: MangaReadingStatus | null): boolean =>
  status === "to_read" || status === "reading";

// Chapitres parus en français après le dernier lu, pour un manga suivi en chapitres.
export const countNewChapters = (
  progress: MangaReadingProgress,
  latestFrenchChapter: number | null | undefined,
): number => {
  if (progress.progressUnit !== "chapter" || latestFrenchChapter == null) {
    return 0;
  }

  return Math.max(0, Math.ceil(latestFrenchChapter - (progress.lastReadChapter ?? 0)));
};

// Série encore en cours dont tous les chapitres parus en français sont lus.
export const isCaughtUp = (
  progress: MangaReadingProgress,
  latestFrenchChapter: number | null | undefined,
  isSeriesCompleted: boolean,
): boolean =>
  progress.progressUnit === "chapter" &&
  latestFrenchChapter != null &&
  !isSeriesCompleted &&
  (progress.lastReadChapter ?? 0) >= latestFrenchChapter;

type SeriesEnd = Pick<
  MangaCompleteResponse,
  "isSeriesCompleted" | "finalChapter" | "finalVolume"
>;

// Dernier chapitre (ou dernier tome) d'une série terminée atteint : l'appli propose « Terminé ».
export const hasReachedSeriesEnd = (manga: SeriesEnd & MangaReadingProgress): boolean => {
  if (!manga.isSeriesCompleted) {
    return false;
  }

  if (manga.progressUnit === "volume") {
    return (
      manga.finalVolume !== null &&
      manga.lastReadVolume !== null &&
      manga.lastReadVolume >= manga.finalVolume
    );
  }

  return (
    manga.finalChapter !== null &&
    manga.lastReadChapter !== null &&
    manga.lastReadChapter >= manga.finalChapter
  );
};

// Ce que l'utilisateur a enregistré pour un manga, sans les données de MangaDex.
export const toEntrySnapshot = (manga: MangaEntrySnapshot): MangaEntrySnapshot => ({
  isInLibrary: manga.isInLibrary,
  readingStatus: manga.readingStatus,
  readingStatusLabel: manga.readingStatusLabel,
  progressUnit: manga.progressUnit,
  lastReadChapter: manga.lastReadChapter,
  lastReadVolume: manga.lastReadVolume,
});
