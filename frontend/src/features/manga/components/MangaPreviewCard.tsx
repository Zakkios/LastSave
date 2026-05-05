import type { MangaShortResponse } from "../types";

interface MangaPreviewCardProps {
  manga: MangaShortResponse;
}

export const MangaPreviewCard = ({ manga }: MangaPreviewCardProps) => {
  return (
    <article className="w-full flex gap-3 p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
      <div className="w-16 h-24 shrink-0 overflow-hidden rounded bg-zinc-800">
        {manga.coverUrl ? (
          <img
            src={manga.coverUrl}
            alt={`Couverture de ${manga.title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-500 text-center px-1">
            Pas d’image
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center min-w-0 text-left">
        <h3 className="text-base font-bold text-zinc-100 mb-1 line-clamp-2 wrap-break-word">
          {manga.title}
        </h3>

        <p className="text-zinc-400 text-sm truncate">
          {manga.author || "Auteur inconnu"}
        </p>
      </div>
    </article>
  );
};
