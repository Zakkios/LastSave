import type { MangaCompleteResponse } from "../types";

interface MangaCardProps {
  manga: MangaCompleteResponse;
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
      <p className="text-zinc-400 mb-4">{manga.description}</p>
      {manga.genres && manga.genres.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          {manga.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-zinc-800 rounded text-zinc-300"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
      {manga.themes && manga.themes.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4 text-sm mb-4">
          {manga.themes.map((theme) => (
            <span
              key={theme}
              className="px-2 py-1 bg-zinc-800 rounded text-zinc-300"
            >
              {theme}
            </span>
          ))}
        </div>
      )}
      <p className="text-zinc-400 mb-4">Tomes : {manga.numberOfVolumes}</p>
      <p className="text-zinc-400 mb-4">Chapitres : {manga.numberOfChapters}</p>
      <p className="text-zinc-400 mb-4">
        Etat de sortie : {manga.publicationStatus}
      </p>
      <p className="text-zinc-400 mb-4">
        Date de sortie : {manga.publicationYear}
      </p>
    </div>
  );
};
