import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export interface ShelfItem {
  key: string;
  title: string;
  coverUrl: string | null;
  href: string;
}

interface InProgressShelfProps {
  title: string;
  icon: ReactNode;
  // Nombre total d'œuvres en cours (null tant qu'il n'est pas connu).
  count: number | null;
  items: ShelfItem[];
  loading: boolean;
  error: string | null;
  seeAllHref: string;
  emptyMessage: string;
  emptyAction: { label: string; href: string };
  placeholderIcon: ReactNode;
}

// Au-delà, « Tout voir » mène à la bibliothèque filtrée sur « En cours ».
const MAX_ITEMS = 6;

// Mobile : une rangée de couvertures qui défile à l'horizontale.
// Écrans plus larges : une grille (3 colonnes, puis 6).
const shelfClassName =
  "-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6";

const InProgressShelf = ({
  title,
  icon,
  count,
  items,
  loading,
  error,
  seeAllHref,
  emptyMessage,
  emptyAction,
  placeholderIcon,
}: InProgressShelfProps) => {
  const visibleItems = items.slice(0, MAX_ITEMS);

  const renderContent = () => {
    if (loading) {
      return (
        <div className={shelfClassName}>
          {Array.from({ length: MAX_ITEMS }, (_, index) => (
            <div key={index} className="w-28 shrink-0 animate-pulse sm:w-auto">
              <div className="aspect-2/3 rounded-lg bg-zinc-800" />
              <div className="mt-2 h-3 w-3/4 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-sm text-red-400">{error}</p>;
    }

    if (visibleItems.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-zinc-800 px-4 py-5 text-sm text-zinc-500">
          {emptyMessage}{" "}
          <Link
            to={emptyAction.href}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {emptyAction.label}
          </Link>
        </p>
      );
    }

    return (
      <div className={shelfClassName}>
        {visibleItems.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className="group w-28 shrink-0 snap-start sm:w-auto"
          >
            <div className="aspect-2/3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-600">
              {item.coverUrl ? (
                <img
                  src={item.coverUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                  {placeholderIcon}
                </div>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-300 transition-colors group-hover:text-zinc-50">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {icon}
          {title}
          {count !== null && count > 0 && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs font-medium normal-case tracking-normal text-zinc-300">
              {count}
            </span>
          )}
        </h3>
        {visibleItems.length > 0 && (
          <Link
            to={seeAllHref}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Tout voir
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {renderContent()}
    </div>
  );
};

export default InProgressShelf;
