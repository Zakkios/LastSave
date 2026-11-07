import { useCallback, useEffect, useState } from "react";
import { advanceMangaEntry, updateMangaEntry } from "../api";
import type { MangaEntrySnapshot, MangaReadingStatus } from "../types";
import { toEntrySnapshot } from "../mangaProgress";
import { getMangaReadingStatusLabel } from "../mangaReadingStatus";

// Temps pendant lequel « Annuler » reste proposé après un +1.
const UNDO_DELAY_MS = 5000;

type MangaWithEntry = MangaEntrySnapshot & { id: string };

/**
 * Changements faits sur la page (+1, annulation, statut, fenêtre) appliqués par-dessus les
 * données chargées : l'affichage suit tout de suite, sans recharger la liste.
 */
export const useMangaEntryUpdates = () => {
  const [updates, setUpdates] = useState<Record<string, MangaEntrySnapshot>>({});
  // Dernier +1, annulable quelques secondes.
  const [undoable, setUndoable] = useState<{
    mangaId: string;
    previous: MangaEntrySnapshot;
  } | null>(null);
  const [pendingMangaId, setPendingMangaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!undoable) {
      return;
    }

    const timer = setTimeout(() => setUndoable(null), UNDO_DELAY_MS);

    return () => clearTimeout(timer);
  }, [undoable]);

  const withUpdates = useCallback(
    <T extends MangaWithEntry>(manga: T): T => {
      const update = updates[manga.id];

      return update ? { ...manga, ...update } : manga;
    },
    [updates],
  );

  const setEntry = useCallback((mangaId: string, entry: MangaEntrySnapshot) => {
    setUpdates((prev) => ({ ...prev, [mangaId]: entry }));
  }, []);

  // `manga` : l'état affiché, changements de la page compris (passer par withUpdates).
  const advance = async (manga: MangaWithEntry) => {
    if (pendingMangaId) {
      return;
    }

    const previous = toEntrySnapshot(manga);
    setPendingMangaId(manga.id);
    setError(null);

    try {
      const result = await advanceMangaEntry(manga.id);
      setEntry(manga.id, { isInLibrary: true, ...result });
      setUndoable({ mangaId: manga.id, previous });
    } catch {
      setError("Impossible d'enregistrer votre progression.");
    } finally {
      setPendingMangaId(null);
    }
  };

  const save = async (mangaId: string, entry: MangaEntrySnapshot) => {
    if (!entry.readingStatus) {
      return;
    }

    await updateMangaEntry({
      providerId: mangaId,
      status: entry.readingStatus,
      progressUnit: entry.progressUnit ?? "chapter",
      lastReadChapter: entry.lastReadChapter,
      lastReadVolume: entry.lastReadVolume,
    });
    setEntry(mangaId, entry);
  };

  const undo = async () => {
    if (!undoable) {
      return;
    }

    const { mangaId, previous } = undoable;
    setUndoable(null);
    setError(null);

    try {
      await save(mangaId, previous);
    } catch {
      setError("Impossible d'annuler le dernier +1.");
    }
  };

  // Propositions « Passer en Terminé » et « Le remettre en cours ». Renvoie true si c'est enregistré.
  const changeStatus = async (
    manga: MangaWithEntry,
    status: MangaReadingStatus,
  ): Promise<boolean> => {
    setError(null);

    try {
      await save(manga.id, {
        ...toEntrySnapshot(manga),
        readingStatus: status,
        readingStatusLabel: getMangaReadingStatusLabel(status),
      });
      return true;
    } catch {
      setError("Impossible de changer le statut.");
      return false;
    }
  };

  return {
    withUpdates,
    setEntry,
    advance,
    undo,
    changeStatus,
    undoMangaId: undoable?.mangaId ?? null,
    pendingMangaId,
    error,
  };
};
