import { useState } from "react";
import { Info, Library } from "lucide-react";
import InProgressShelf, { type ShelfItem } from "./InProgressShelf";
import DashboardNotice from "./DashboardNotice";
import { useMangaLibrary } from "../../manga/hooks/useMangaLibrary";
import { useMangaEntryUpdates } from "../../manga/hooks/useMangaEntryUpdates";
import { useLatestFrenchChapters } from "../../manga/hooks/useLatestFrenchChapters";
import { useResumableMangas } from "../../manga/hooks/useResumableMangas";
import {
  canAdvance,
  countNewChapters,
  formatProgress,
  hasReachedSeriesEnd,
  isCaughtUp,
} from "../../manga/mangaProgress";
import type { MangaCompleteResponse } from "../../manga/types";

// Même nombre que la rangée affiche (les badges ne sont demandés que pour ceux-là).
const MAX_VISIBLE = 6;

const uniqueById = (mangas: MangaCompleteResponse[]) => {
  const seen = new Set<string>();

  return mangas.filter((manga) => {
    if (seen.has(manga.id)) {
      return false;
    }

    seen.add(manga.id);
    return true;
  });
};

interface ReadingMangaShelfProps {
  // Nombre de mangas « En cours » d'après les chiffres de la collection.
  readingCount: number | null;
}

// Rangée « Mangas » de « En cours » : progression, +1 annulable, badges des nouveaux
// chapitres en français et propositions de statut (« Terminé », « remettre en cours »).
const ReadingMangaShelf = ({ readingCount }: ReadingMangaShelfProps) => {
  const readingMangas = useMangaLibrary("reading");
  const entryUpdates = useMangaEntryUpdates();
  const resumable = useResumableMangas();
  // Mangas remis en cours depuis un bandeau : ajoutés à la rangée sans recharger.
  const [resumedMangas, setResumedMangas] = useState<MangaCompleteResponse[]>([]);
  // Propositions écartées (« Plus tard », « Ignorer ») le temps de la visite.
  const [dismissedNotices, setDismissedNotices] = useState<string[]>([]);

  const reading = uniqueById([...resumedMangas, ...readingMangas.items])
    .map((manga) => entryUpdates.withUpdates(manga))
    .filter((manga) => manga.readingStatus === "reading");
  const visible = reading.slice(0, MAX_VISIBLE);

  const latestChapters = useLatestFrenchChapters(
    visible.filter((manga) => manga.progressUnit === "chapter").map((manga) => manga.id),
  );

  // Le chiffre suit les changements faits ici (passé en « Terminé », remis en cours).
  const leftReading = readingMangas.items.filter(
    (manga) => entryUpdates.withUpdates(manga).readingStatus !== "reading",
  ).length;
  const resumedReading = resumedMangas.filter(
    (manga) =>
      entryUpdates.withUpdates(manga).readingStatus === "reading" &&
      !readingMangas.items.some((item) => item.id === manga.id),
  ).length;
  const count =
    readingCount === null ? null : Math.max(0, readingCount - leftReading + resumedReading);

  const items: ShelfItem[] = visible.map((manga) => {
    const latest = latestChapters.data?.[manga.id];
    const newChapters = countNewChapters(manga, latest);
    let badge: ShelfItem["badge"];

    if (newChapters > 0) {
      badge = { label: `${newChapters} nouveau${newChapters > 1 ? "x" : ""}`, tone: "accent" };
    } else if (isCaughtUp(manga, latest, manga.isSeriesCompleted)) {
      badge = { label: "À jour", tone: "muted" };
    }

    return {
      key: manga.id,
      title: manga.title,
      coverUrl: manga.coverUrl || null,
      href: `/manga/${manga.id}`,
      badge,
      progress: {
        label: formatProgress(manga),
        advanceLabel: `Ajouter ${manga.progressUnit === "volume" ? "un tome" : "un chapitre"} lu à ${manga.title}`,
        onAdvance: canAdvance(manga.readingStatus)
          ? () => void entryUpdates.advance(manga)
          : undefined,
        isAdvancing: entryUpdates.pendingMangaId === manga.id,
        showUndo: entryUpdates.undoMangaId === manga.id,
        onUndo: () => void entryUpdates.undo(),
      },
    };
  });

  const dismiss = (key: string) => setDismissedNotices((prev) => [...prev, key]);

  const endReached = reading.filter(
    (manga) => hasReachedSeriesEnd(manga) && !dismissedNotices.includes(`end-${manga.id}`),
  );
  const toResume = (resumable.data ?? [])
    .map((manga) => entryUpdates.withUpdates(manga))
    .filter(
      (manga) =>
        manga.readingStatus === "completed" && !dismissedNotices.includes(`resume-${manga.id}`),
    );

  const handleResume = async (manga: MangaCompleteResponse) => {
    if (await entryUpdates.changeStatus(manga, "reading")) {
      setResumedMangas((prev) => [manga, ...prev]);
    }
  };

  const hasNotices = endReached.length > 0 || toResume.length > 0 || entryUpdates.error;

  const notices = hasNotices && (
    <div className="flex flex-col gap-2">
      {entryUpdates.error && <p className="text-sm text-red-400">{entryUpdates.error}</p>}

      {endReached.map((manga) => (
        <DashboardNotice
          key={`end-${manga.id}`}
          confirmLabel="Passer en « Terminé »"
          onConfirm={() => void entryUpdates.changeStatus(manga, "completed")}
          dismissLabel="Plus tard"
          onDismiss={() => dismiss(`end-${manga.id}`)}
        >
          <strong className="font-semibold text-zinc-50">{manga.title}</strong> :{" "}
          {manga.progressUnit === "volume" ? "dernier tome atteint" : "dernier chapitre atteint"}.
          Passer en « Terminé » ?
        </DashboardNotice>
      ))}

      {toResume.map((manga) => (
        <DashboardNotice
          key={`resume-${manga.id}`}
          confirmLabel="Le remettre en cours"
          onConfirm={() => void handleResume(manga)}
          dismissLabel="Ignorer"
          onDismiss={() => dismiss(`resume-${manga.id}`)}
        >
          Nouveau chapitre pour{" "}
          <strong className="font-semibold text-zinc-50">{manga.title}</strong>, que vous
          aviez terminé.
        </DashboardNotice>
      ))}
    </div>
  );

  const footnote = visible.some((manga) => manga.progressUnit === "chapter") && (
    <p className="flex items-start gap-2 text-xs text-zinc-500">
      <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      Nouveaux chapitres : d'après MangaDex, en français uniquement. Certaines séries n'y
      sont pas à jour.
    </p>
  );

  return (
    <InProgressShelf
      title="Mangas"
      icon={<Library className="h-4 w-4" />}
      count={count}
      items={items}
      loading={readingMangas.loading}
      error={readingMangas.error}
      seeAllHref="/mangas?status=reading"
      emptyMessage="Aucun manga en cours de lecture."
      emptyAction={{ label: "Trouver un manga", href: "/search?tab=mangas" }}
      placeholderIcon={<Library className="h-8 w-8" />}
      notices={notices}
      footnote={footnote}
    />
  );
};

export default ReadingMangaShelf;
