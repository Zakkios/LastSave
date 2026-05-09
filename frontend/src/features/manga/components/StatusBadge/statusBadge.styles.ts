import type { StatusVariant } from "./statusBadge.types";

export const statusBadges: Record<StatusVariant, string> = {
  to_read: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
  reading: "border border-violet-500/30 bg-violet-500/10 text-violet-300",
  completed: "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  dropped: "border border-rose-500/30 bg-rose-500/10 text-rose-300",
};
