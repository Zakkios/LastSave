import { useState } from "react";
import Button from "../../../shared/components/Button/Button";
import StatusBadge from "./StatusBadge/StatusBadge";
import type { MangaCompleteResponse, MangaLibraryStatus } from "../types";
import MangaEntryModal from "./MangaEntryModal";

interface MangaCardProps {
  manga: MangaCompleteResponse;
}

export const MangaCard = ({ manga }: MangaCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [localLibraryStatus, setLocalLibraryStatus] = useState<{
    mangaId: string;
    status: MangaLibraryStatus;
  } | null>(null);

  const libraryStatus =
    localLibraryStatus?.mangaId === manga.id
      ? localLibraryStatus.status
      : {
          isInLibrary: manga.isInLibrary,
          readingStatus: manga.readingStatus,
          readingStatusLabel: manga.readingStatusLabel,
        };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaved = (status: MangaLibraryStatus) => {
    setLocalLibraryStatus({
      mangaId: manga.id,
      status,
    });
  };

  return (
    <>
      <MangaEntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        manga={manga}
        status={libraryStatus.readingStatus}
        isInLibrary={libraryStatus.isInLibrary}
        onSaved={handleSaved}
      />

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
        <p className="mb-2 text-sm text-zinc-400">
          ID: <span className="font-mono text-zinc-200">{manga.id}</span>{" "}
          {libraryStatus.isInLibrary &&
          libraryStatus.readingStatus &&
          libraryStatus.readingStatusLabel ? (
            <StatusBadge
              label={libraryStatus.readingStatusLabel}
              status={libraryStatus.readingStatus}
            />
          ) : (
            <span className="text-zinc-500">(Pas dans la bibliothèque)</span>
          )}
        </p>

        <Button
          variant="primary"
          size="sm"
          className="my-4"
          onClick={openModal}
        >
          {libraryStatus.isInLibrary ? "Modifier" : "Ajouter à ma bibliothèque"}
        </Button>

        <h3 className="mb-1 text-xl font-bold">{manga.title}</h3>

        <p className="mb-4 text-zinc-400">{manga.author}</p>

        {manga.coverUrl && (
          <img
            src={manga.coverUrl}
            alt={`Couverture de ${manga.title}`}
            className="m-auto max-h-64 rounded object-cover shadow-lg"
          />
        )}

        <p className="mb-4 text-zinc-400">{manga.description}</p>

        {manga.genres && manga.genres.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
            {manga.genres.map((genre) => (
              <span
                key={genre}
                className="rounded bg-zinc-800 px-2 py-1 text-zinc-300"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {manga.themes && manga.themes.length > 0 && (
          <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
            {manga.themes.map((theme) => (
              <span
                key={theme}
                className="rounded bg-zinc-800 px-2 py-1 text-zinc-300"
              >
                {theme}
              </span>
            ))}
          </div>
        )}

        <p className="mb-4 text-zinc-400">Tomes : {manga.numberOfVolumes}</p>

        <p className="mb-4 text-zinc-400">
          Chapitres : {manga.numberOfChapters}
        </p>

        <p className="mb-4 text-zinc-400">
          État de sortie : {manga.publicationStatus}
        </p>

        <p className="mb-4 text-zinc-400">
          Date de sortie : {manga.publicationYear}
        </p>
      </div>
    </>
  );
};

export default MangaCard;
