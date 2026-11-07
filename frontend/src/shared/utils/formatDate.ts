const relativeFormatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

// Les dates de sortie IGDB sont des jours (AAAA-MM-JJ) en UTC.
const releaseDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

/** « il y a 2 jours », « dans 3 semaines », « à l'instant ». */
export const formatRelativeDate = (date: Date, now: Date = new Date()): string => {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return relativeFormatter.format(Math.round(seconds / size), unit);
    }
  }

  return "à l'instant";
};

/** « 19 nov. 2026 » à partir de « 2026-11-19 ». */
export const formatReleaseDate = (releaseDate: string): string =>
  releaseDateFormatter.format(parseReleaseDate(releaseDate));

export const parseReleaseDate = (releaseDate: string): Date =>
  new Date(`${releaseDate}T00:00:00Z`);
