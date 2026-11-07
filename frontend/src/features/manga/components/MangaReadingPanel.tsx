import Button from "../../../shared/components/Button/Button";
import { Card, CardContent } from "../../../shared/components/Card/Card";
import type { MangaCompleteResponse, MangaReadingStatus } from "../types";
import {
  canAdvance,
  countNewChapters,
  formatChapterNumber,
  getProgressValue,
  hasReachedSeriesEnd,
} from "../mangaProgress";

interface MangaReadingPanelProps {
  // Le manga avec les changements faits sur la page (+1, fenêtre…).
  manga: MangaCompleteResponse;
  onAdvance: () => void;
  isAdvancing: boolean;
  showUndo: boolean;
  onUndo: () => void;
  onChangeStatus: (status: MangaReadingStatus) => void;
  error: string | null;
}

// Encart « Ma lecture » de la fiche : progression, +1, nouveautés en français et propositions de statut.
const MangaReadingPanel = ({
  manga,
  onAdvance,
  isAdvancing,
  showUndo,
  onUndo,
  onChangeStatus,
  error,
}: MangaReadingPanelProps) => {
  const isChapter = manga.progressUnit !== "volume";
  const latest = manga.latestFrenchChapter;
  const newChapters = countNewChapters(manga, latest);
  const reachedEnd = hasReachedSeriesEnd(manga) && manga.readingStatus !== "completed";
  // « Terminé » alors que la série continue et qu'un chapitre est sorti depuis.
  const canResume =
    manga.readingStatus === "completed" &&
    isChapter &&
    !manga.isSeriesCompleted &&
    newChapters > 0;
  const progressValue = getProgressValue(manga);
  const progressText =
    progressValue === null
      ? "—"
      : isChapter
        ? formatChapterNumber(progressValue)
        : String(progressValue);

  return (
    <Card>
      <CardContent className="space-y-3 p-4 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Ma lecture
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-400">
            {isChapter ? "Dernier chapitre lu" : "Dernier tome lu"}
          </span>
          <span className="flex items-center gap-2">
            <span className="font-medium text-zinc-100 tabular-nums">
              {progressText}
            </span>
            {canAdvance(manga.readingStatus) && (
              <Button
                variant="tonal"
                size="xs"
                onClick={onAdvance}
                disabled={isAdvancing}
                aria-label={`Ajouter ${isChapter ? "un chapitre" : "un tome"} lu à ${manga.title}`}
              >
                +1
              </Button>
            )}
          </span>
        </div>

        {showUndo && (
          <div className="flex justify-center">
            <Button variant="ghost" size="xs" onClick={onUndo}>
              Annuler
            </Button>
          </div>
        )}

        {isChapter && latest !== null && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-zinc-400">Paru en français</span>
              <span className="font-medium text-zinc-100 tabular-nums">
                chap. {formatChapterNumber(latest)}
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${newChapters > 0 ? "text-indigo-300" : "text-zinc-500"}`}>
              {newChapters > 0
                ? `${newChapters} chapitre${newChapters > 1 ? "s" : ""} à lire.`
                : "Vous êtes à jour."}{" "}
              <span className="text-zinc-500">D'après MangaDex.</span>
            </p>
          </>
        )}

        {isChapter && latest === null && manga.progressUnit === "chapter" && (
          <p className="text-xs leading-relaxed text-zinc-500">
            Aucun chapitre en français sur MangaDex pour cette série.
          </p>
        )}

        {reachedEnd && (
          <div className="space-y-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
            <p className="text-zinc-200">
              {isChapter ? "Dernier chapitre atteint." : "Dernier tome atteint."} La série est terminée.
            </p>
            <Button variant="primary" size="xs" onClick={() => onChangeStatus("completed")}>
              Passer en « Terminé »
            </Button>
          </div>
        )}

        {canResume && (
          <div className="space-y-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3">
            <p className="text-zinc-200">
              {newChapters > 1 ? "De nouveaux chapitres sont parus" : "Un nouveau chapitre est paru"} depuis
              que vous l'avez terminé.
            </p>
            <Button variant="primary" size="xs" onClick={() => onChangeStatus("reading")}>
              Le remettre en cours
            </Button>
          </div>
        )}

        {error && <p className="text-xs text-red-400">{error}</p>}
      </CardContent>
    </Card>
  );
};

export default MangaReadingPanel;
