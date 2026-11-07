import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import Button from "../../../shared/components/Button/Button";

export interface ShelfItem {
  key: string;
  title: string;
  coverUrl: string | null;
  href: string;
  // Badge en haut à gauche de la couverture : « 3 nouveaux » (accent) ou « À jour » (discret).
  badge?: { label: string; tone: "accent" | "muted" };
  // Progression sous le titre, avec son +1 (mangas uniquement).
  progress?: {
    label: string | null;
    // Texte lu par les lecteurs d'écran pour le +1.
    advanceLabel: string;
    onAdvance?: () => void;
    isAdvancing: boolean;
    showUndo: boolean;
    onUndo: () => void;
  };
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
  // Bandeaux au-dessus de la rangée (propositions de statut).
  notices?: ReactNode;
  // Précision sous la rangée (d'où viennent les nouveautés).
  footnote?: ReactNode;
}

// Au-delà, « Tout voir » mène à la bibliothèque filtrée sur « En cours ».
const MAX_ITEMS = 6;

// Mobile : une rangée de couvertures qui défile à l'horizontale.
// Écrans plus larges : une grille (3 colonnes, puis 6).
const shelfClassName =
  "-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-6";

const badgeClassNames = {
  accent: "bg-indigo-600 font-semibold text-white shadow",
  muted: "border border-zinc-700 bg-zinc-950/90 font-medium text-zinc-300",
};

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
  notices,
  footnote,
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
          <div key={item.key} className="w-28 shrink-0 snap-start sm:w-auto">
            <Link to={item.href} className="group block">
              <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-colors group-hover:border-zinc-600">
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
                {item.badge && (
                  <span
                    className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[11px] tabular-nums ${badgeClassNames[item.badge.tone]}`}
                  >
                    {item.badge.label}
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-300 transition-colors group-hover:text-zinc-50">
                {item.title}
              </p>
            </Link>

            {item.progress && (
              <>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-zinc-500 tabular-nums">
                    {item.progress.label ?? "Pas commencé"}
                  </span>
                  {item.progress.onAdvance && (
                    <Button
                      variant="tonal"
                      size="xs"
                      onClick={item.progress.onAdvance}
                      disabled={item.progress.isAdvancing}
                      aria-label={item.progress.advanceLabel}
                      className="shrink-0"
                    >
                      +1
                    </Button>
                  )}
                </div>
                {/* Annuler le dernier +1, quelques secondes, centré sous la carte. */}
                {item.progress.showUndo && (
                  <div className="mt-1 flex justify-center">
                    <Button variant="ghost" size="xs" onClick={item.progress.onUndo}>
                      Annuler
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
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
      {notices}
      {renderContent()}
      {footnote}
    </div>
  );
};

export default InProgressShelf;
