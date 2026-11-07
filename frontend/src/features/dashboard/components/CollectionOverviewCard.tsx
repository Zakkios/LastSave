import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../../shared/components/Card/Card";
import type { GameStatus } from "../../game/types";
import type { MangaReadingStatus } from "../../manga/types";
import { statusFillColors } from "../statusColors";

export interface StatusSegment {
  status: MangaReadingStatus | GameStatus;
  label: string;
  count: number;
}

interface CollectionOverviewCardProps {
  title: string;
  icon: ReactNode;
  // Bibliothèque correspondante ; chaque statut y mène, déjà filtré.
  libraryHref: string;
  total: number;
  segments: StatusSegment[];
}

// Une carte par type d'œuvre : total, répartition par statut (barre + légende cliquable).
const CollectionOverviewCard = ({
  title,
  icon,
  libraryHref,
  total,
  segments,
}: CollectionOverviewCardProps) => {
  const summary = segments
    .map((segment) => `${segment.label} : ${segment.count}`)
    .join(", ");

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-zinc-400">
              {icon}
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-zinc-50">{total}</p>
          </div>
          <Link
            to={libraryHref}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Bibliothèque
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div
          role="img"
          aria-label={`Répartition par statut : ${summary}`}
          className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-zinc-800"
        >
          {total > 0 &&
            segments
              .filter((segment) => segment.count > 0)
              .map((segment) => (
                <div
                  key={segment.status}
                  title={`${segment.label} : ${segment.count}`}
                  className={statusFillColors[segment.status]}
                  style={{ width: `${(segment.count / total) * 100}%` }}
                />
              ))}
        </div>

        <ul className="grid grid-cols-2 gap-1">
          {segments.map((segment) => (
            <li key={segment.status}>
              <Link
                to={`${libraryHref}?status=${segment.status}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-zinc-900"
              >
                <span className="flex min-w-0 items-center gap-2 text-zinc-400">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${statusFillColors[segment.status]}`}
                  />
                  <span className="truncate">{segment.label}</span>
                </span>
                <span className="font-medium text-zinc-100">{segment.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export const CollectionOverviewSkeleton = () => (
  <Card>
    <CardContent className="animate-pulse space-y-4 p-5">
      <div className="h-4 w-1/3 rounded bg-zinc-800" />
      <div className="h-8 w-16 rounded bg-zinc-800" />
      <div className="h-2 rounded-full bg-zinc-800" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-4 rounded bg-zinc-800" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default CollectionOverviewCard;
