import type { MangaReadingStatus } from "../../types";

export type StatusVariant = MangaReadingStatus;

export interface StatusBadgeProps {
  status: StatusVariant;
  label: string;
}
