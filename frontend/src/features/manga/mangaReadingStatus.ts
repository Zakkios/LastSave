import type { StatusVariant } from "./components/StatusBadge/statusBadge.types";

export const mangaReadingStatusLabels: Record<StatusVariant, string> = {
  to_read: "À lire",
  reading: "En cours",
  completed: "Terminé",
  dropped: "Abandonné",
};

export const mangaReadingStatusOptions = Object.entries(
  mangaReadingStatusLabels,
).map(([value, label]) => ({
  value,
  label,
}));

export const getMangaReadingStatusLabel = (status: StatusVariant): string => {
  return mangaReadingStatusLabels[status];
};

export const isMangaReadingStatus = (value: string): value is StatusVariant => {
  return value in mangaReadingStatusLabels;
};
