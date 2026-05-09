import { useEffect, useState } from "react";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import type { MangaCompleteResponse, MangaLibraryStatus } from "../types";
import Button from "../../../shared/components/Button/Button";
import { createMangaEntry, updateMangaEntry } from "../api";
import FlashMessage from "../../../shared/components/FlashMessage/FlashMessage";
import FullPageLoading from "../../../shared/components/FullPageLoading";
import type { StatusVariant } from "./StatusBadge/statusBadge.types";
import {
  getMangaReadingStatusLabel,
  isMangaReadingStatus,
  mangaReadingStatusOptions,
} from "../mangaReadingStatus";

type MangaEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  manga: MangaCompleteResponse;
  status: StatusVariant | null;
  isInLibrary: boolean;
  onSaved: (status: MangaLibraryStatus) => void;
};

const MangaEntryModal = ({
  isOpen,
  onClose,
  manga,
  status,
  isInLibrary,
  onSaved,
}: MangaEntryModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusVariant | "">(
    status ?? "",
  );
  const [flashMessage, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedStatus(status ?? "");
    setFlashMessage("");
  }, [isOpen, status]);

  if (!isOpen) {
    return null;
  }

  const handleStatusChange = (value: string) => {
    if (isMangaReadingStatus(value)) {
      setSelectedStatus(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      setFlashMessage("Choisis un statut avant d'ajouter le manga.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        providerId: manga.id,
        status: selectedStatus,
      };

      if (isInLibrary) {
        await updateMangaEntry(payload);
      } else {
        await createMangaEntry(payload);
      }

      onSaved({
        isInLibrary: true,
        readingStatus: selectedStatus,
        readingStatusLabel: getMangaReadingStatusLabel(selectedStatus),
      });

      onClose();
    } catch {
      setFlashMessage(
        isInLibrary
          ? "Impossible de mettre à jour ce manga."
          : "Impossible d'ajouter ce manga à ta liste.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullPageLoading />}
      <div
        className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            ✕
          </Button>
          <div className="mb-5 flex items-start justify-center gap-4 text-center">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">
                {isInLibrary ? "Modifier ma liste" : "Ajouter à ma liste"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Choisis l’état de lecture pour ce manga.
              </p>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            {manga.coverUrl && (
              <img
                src={manga.coverUrl}
                alt={`Couverture de ${manga.title}`}
                className="h-36 w-24 shrink-0 rounded-md object-cover shadow-md"
              />
            )}

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-zinc-100">
                {manga.title}
              </h3>

              {manga.author && (
                <p className="mt-1 text-sm text-zinc-400">
                  Auteur : {manga.author}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {manga.publicationYear && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.publicationYear}
                  </span>
                )}

                {manga.numberOfChapters && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.numberOfChapters} chapitres
                  </span>
                )}

                {manga.publicationStatus && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.publicationStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Dropdown
              label="État de lecture"
              name="status"
              value={selectedStatus}
              options={mangaReadingStatusOptions}
              placeholder="Choisir un statut"
              onChange={handleStatusChange}
            />
            {flashMessage && (
              <div className="mb-4">
                <FlashMessage
                  message={flashMessage}
                  variant="error"
                  onClose={() => setFlashMessage("")}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Annuler
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSubmit}
              disabled={!selectedStatus || loading}
              className="py-2.5"
            >
              {isInLibrary ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MangaEntryModal;
