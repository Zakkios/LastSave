import { Link } from "react-router";
import { Gamepad2, Library } from "lucide-react";
import { Card } from "../../../shared/components/Card/Card";
import StatusBadge from "../../manga/components/StatusBadge/StatusBadge";
import GameStatusBadge from "../../game/components/GameStatusBadge";
import type { RecentEntry } from "../../library/types";
import { formatRelativeDate } from "../../../shared/utils/formatDate";

interface RecentActivityListProps {
  entries: RecentEntry[];
  loading: boolean;
  error: string | null;
}

const ListSkeleton = () => (
  <Card className="divide-y divide-zinc-800">
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className="flex animate-pulse gap-3 p-3">
        <div className="h-14 w-10 shrink-0 rounded bg-zinc-800" />
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="h-3 w-2/3 rounded bg-zinc-800" />
          <div className="h-3 w-1/3 rounded bg-zinc-800" />
        </div>
      </div>
    ))}
  </Card>
);

// Derniers ajouts et changements de statut, mangas et jeux mélangés.
const RecentActivityList = ({ entries, loading, error }: RecentActivityListProps) => {
  if (loading) {
    return <ListSkeleton />;
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-5 text-sm text-zinc-500">
        Vos ajouts et changements de statut apparaîtront ici.
      </p>
    );
  }

  const now = new Date();

  return (
    <Card className="divide-y divide-zinc-800">
      {entries.map((entry) => {
        const TypeIcon = entry.type === "manga" ? Library : Gamepad2;

        return (
          <Link
            key={`${entry.type}-${entry.id}`}
            to={`/${entry.type}/${entry.id}`}
            className="flex items-center gap-3 p-3 transition-colors hover:bg-zinc-900"
          >
            <div className="flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-800">
              {entry.coverUrl ? (
                <img
                  src={entry.coverUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <TypeIcon className="h-5 w-5 text-zinc-600" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-100">
                {entry.title}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{entry.action === "added" ? "Ajouté" : "Statut modifié"}</span>
                {entry.type === "manga" ? (
                  <StatusBadge status={entry.status} label={entry.statusLabel} />
                ) : (
                  <GameStatusBadge status={entry.status} label={entry.statusLabel} />
                )}
              </div>
            </div>

            <time
              dateTime={entry.updatedAt}
              className="shrink-0 text-xs text-zinc-500"
            >
              {formatRelativeDate(new Date(entry.updatedAt), now)}
            </time>
          </Link>
        );
      })}
    </Card>
  );
};

export default RecentActivityList;
