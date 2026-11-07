import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import type {
  MangaCompleteResponse,
  MangaEntrySnapshot,
  MangaReadingStatus,
  ProgressUnit,
} from "../types";
import Button from "../../../shared/components/Button/Button";
import { createMangaEntry, deleteMangaEntry, updateMangaEntry } from "../api";
import FlashMessage from "../../../shared/components/FlashMessage/FlashMessage";
import FullPageLoading from "../../../shared/components/FullPageLoading";
import {
  getMangaReadingStatusLabel,
  isMangaReadingStatus,
  mangaReadingStatusOptions,
} from "../mangaReadingStatus";
import { formatChapterNumber } from "../mangaProgress";

type MangaEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  manga: MangaCompleteResponse;
  // Ce que l'utilisateur a enregistré (statut, progression), changements de la page compris.
  entry: MangaEntrySnapshot;
  onSaved: (entry: MangaEntrySnapshot) => void;
};

type MangaEntryModalContentProps = Omit<MangaEntryModalProps, "isOpen">;

// Mêmes limites que le back (MangaEntryService).
const MAX_CHAPTER = 100000;
const MAX_VOLUME = 1000;

const unitOptions: { value: ProgressUnit; label: string }[] = [
  { value: "chapter", label: "Chapitres" },
  { value: "volume", label: "Tomes" },
];

// "1094,5" ou "1094.5" -> 1094.5 ; vide -> null ; sinon "invalid".
const parseProgressNumber = (
  value: string,
  unit: ProgressUnit,
): number | null | "invalid" => {
  const normalized = value.trim().replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const number = Number(normalized);
  const max = unit === "chapter" ? MAX_CHAPTER : MAX_VOLUME;

  if (
    !Number.isFinite(number) ||
    number < 0 ||
    number > max ||
    (unit === "volume" && !Number.isInteger(number))
  ) {
    return "invalid";
  }

  return number;
};

const numberToInput = (value: number | null): string =>
  value === null ? "" : String(value);

// MangaDex écrit « Inconnu » quand il ne sait pas : rien à afficher dans ce cas.
const isKnown = (value: string) => value !== "" && value !== "Inconnu";

const MangaEntryModalContent = ({
  onClose,
  manga,
  entry,
  onSaved,
}: MangaEntryModalContentProps) => {
  const { isInLibrary } = entry;
  const [selectedStatus, setSelectedStatus] = useState<MangaReadingStatus | "">(
    entry.readingStatus ?? "",
  );
  const [unit, setUnit] = useState<ProgressUnit>(entry.progressUnit ?? "chapter");
  // Les deux numéros sont gardés : changer de format ne fait rien perdre.
  const [chapterInput, setChapterInput] = useState(numberToInput(entry.lastReadChapter));
  const [volumeInput, setVolumeInput] = useState(numberToInput(entry.lastReadVolume));
  const [flashMessage, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

  const isChapter = unit === "chapter";
  const progressInput = isChapter ? chapterInput : volumeInput;
  const setProgressInput = isChapter ? setChapterInput : setVolumeInput;

  const handleStatusChange = (value: string) => {
    if (isMangaReadingStatus(value)) {
      setSelectedStatus(value);
    }
  };

  // − / + : un chapitre (ou tome) de moins ou de plus ; depuis 1094,5 on passe à 1094 ou 1095.
  const handleStep = (step: -1 | 1) => {
    const current = parseProgressNumber(progressInput, unit);
    const value = typeof current === "number" ? current : 0;
    const next = step === 1 ? Math.floor(value) + 1 : Math.max(0, Math.ceil(value) - 1);

    setProgressInput(String(Math.min(next, isChapter ? MAX_CHAPTER : MAX_VOLUME)));
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      setFlashMessage("Choisis un statut avant d'ajouter le manga.");
      return;
    }

    const lastReadChapter = parseProgressNumber(chapterInput, "chapter");
    const lastReadVolume = parseProgressNumber(volumeInput, "volume");

    if (lastReadChapter === "invalid" || lastReadVolume === "invalid") {
      setFlashMessage(
        isChapter
          ? "Ce numéro de chapitre n'est pas valide."
          : "Ce numéro de tome n'est pas valide (nombre entier).",
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        providerId: manga.id,
        status: selectedStatus,
        progressUnit: unit,
        lastReadChapter,
        lastReadVolume,
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
        progressUnit: unit,
        lastReadChapter,
        lastReadVolume,
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

  const handleRemove = async () => {
    setLoading(true);

    try {
      await deleteMangaEntry(manga.id);

      onSaved({
        isInLibrary: false,
        readingStatus: null,
        readingStatusLabel: null,
        progressUnit: null,
        lastReadChapter: null,
        lastReadVolume: null,
      });

      onClose();
    } catch {
      setIsConfirmingRemoval(false);
      setFlashMessage("Impossible de retirer ce manga de ta liste.");
    } finally {
      setLoading(false);
    }
  };

  // Aide sous le numéro : saisie directe à l'ajout, fin de série, dernier chapitre paru.
  const hints: string[] = [];

  if (!isInLibrary) {
    hints.push("Facultatif. Tape directement le numéro où tu en es.");
  }

  if (isChapter) {
    if (manga.isSeriesCompleted && manga.finalChapter !== null) {
      hints.push(`La série est terminée en ${formatChapterNumber(manga.finalChapter)} chapitres.`);
    } else if (manga.latestFrenchChapter !== null) {
      hints.push(
        `Dernier chapitre paru en français sur MangaDex : ${formatChapterNumber(manga.latestFrenchChapter)}.`,
      );
    }
  } else {
    if (manga.isSeriesCompleted && manga.finalVolume !== null) {
      hints.push(`La série est terminée en ${manga.finalVolume} tomes.`);
    }
    hints.push("En tomes, pas de badge « nouveaux » : MangaDex ne connaît pas les sorties des tomes en France.");
  }

  return (
    <>
      {loading && <FullPageLoading />}
      <div
        className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative max-h-full w-full max-w-lg overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2"
            aria-label="Fermer"
          >
            ✕
          </Button>
          <div className="mb-5 flex items-start justify-center gap-4 text-center">
            <div>
              <h2 className="text-xl font-bold text-zinc-100">
                {isInLibrary ? "Gérer ma lecture" : "Ajouter à ma liste"}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {isInLibrary
                  ? "Ton statut et où tu en es dans ce manga."
                  : "Choisis un statut et, si tu veux, où tu en es."}
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

            <div className="flex min-w-0 flex-col justify-center">
              <h3 className="text-lg font-semibold text-zinc-100">
                {manga.title}
              </h3>

              {manga.author && (
                <p className="mt-1 text-sm text-zinc-400">
                  Auteur : {manga.author}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {isKnown(manga.publicationYear) && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.publicationYear}
                  </span>
                )}

                {isKnown(manga.numberOfChapters) && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.numberOfChapters} chapitres
                  </span>
                )}

                {isKnown(manga.publicationStatus) && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {manga.publicationStatus}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <Dropdown
              label="Statut"
              name="status"
              value={selectedStatus}
              options={mangaReadingStatusOptions}
              placeholder="Choisir un statut"
              onChange={handleStatusChange}
            />
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-200">Où j'en suis</p>
              <div
                role="radiogroup"
                aria-label="Suivre en"
                className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-sm"
              >
                {unitOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={unit === option.value}
                    onClick={() => setUnit(option.value)}
                    className={`cursor-pointer rounded-md px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      unit === option.value
                        ? "bg-zinc-800 text-zinc-50"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label
                htmlFor="manga-progress"
                className="min-w-0 flex-1 text-sm text-zinc-400"
              >
                {isChapter ? "Dernier chapitre lu" : "Dernier tome lu"}
              </label>
              <div className="flex items-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 focus-within:ring-1 focus-within:ring-indigo-500">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  aria-label={isChapter ? "Un chapitre de moins" : "Un tome de moins"}
                  className="cursor-pointer px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id="manga-progress"
                  type="text"
                  inputMode={isChapter ? "decimal" : "numeric"}
                  autoComplete="off"
                  placeholder={isChapter ? "ex. 12" : "ex. 3"}
                  value={progressInput}
                  onChange={(event) => setProgressInput(event.target.value)}
                  className="w-24 bg-transparent py-2 text-center text-sm text-zinc-50 tabular-nums outline-none placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  aria-label={isChapter ? "Un chapitre de plus" : "Un tome de plus"}
                  className="cursor-pointer px-3 py-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {hints.length > 0 && (
              <p className="text-xs leading-relaxed text-zinc-500">
                {hints.join(" ")}
              </p>
            )}

            {flashMessage && (
              <FlashMessage
                message={flashMessage}
                variant="error"
                onClose={() => setFlashMessage("")}
              />
            )}
          </div>

          {isConfirmingRemoval ? (
            // Confirmation avant de retirer : l'entrée, son statut et sa progression seront perdus.
            <div className="space-y-4 rounded-lg border border-rose-900/50 bg-rose-950/20 p-4">
              <p className="text-sm text-zinc-200">
                Retirer « {manga.title} » de ta liste ? Son statut et ta progression seront perdus.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsConfirmingRemoval(false)}
                >
                  Annuler
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleRemove}
                  disabled={loading}
                >
                  Retirer
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              {isInLibrary ? (
                <Button
                  variant="danger-ghost"
                  size="sm"
                  onClick={() => setIsConfirmingRemoval(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Retirer de ma liste
                </Button>
              ) : (
                <span />
              )}
              <div className="flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!selectedStatus || loading}
                >
                  {isInLibrary ? "Enregistrer" : "Ajouter"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Le contenu n'est monté que modale ouverte : son état (statut, numéro, message)
// repart donc des props à chaque ouverture, sans useEffect de réinitialisation.
const MangaEntryModal = ({ isOpen, ...props }: MangaEntryModalProps) => {
  if (!isOpen) {
    return null;
  }

  return <MangaEntryModalContent {...props} />;
};

export default MangaEntryModal;
