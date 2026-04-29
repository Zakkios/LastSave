import type { MangaResponse } from "../types";

interface MangaCardProps {
  manga: MangaResponse;
}

export const MangaCard = ({ manga }: MangaCardProps) => {
  return (
    <div className="text-center p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
      <p className="mb-2 text-zinc-400 text-sm">
        ID: <span className="font-mono text-zinc-200">{manga.id}</span>
      </p>
      <h3 className="text-xl font-bold mb-1">{manga.title}</h3>
      <p className="text-zinc-400 mb-4">{manga.author}</p>
      {manga.coverUrl && (
        <img 
          src={manga.coverUrl} 
          alt={`Couverture de ${manga.title}`} 
          className="m-auto rounded shadow-lg max-h-64 object-cover"
        />
      )}
    </div>
  );
};
