import { useState } from "react";
import Dropdown from "../../../shared/components/Dropdown/Dropdown";
import type {
  GameCompleteResponse,
  GameLibraryStatus,
  GameStatus,
} from "../types";
import Button from "../../../shared/components/Button/Button";
import { createGameEntry, deleteGameEntry, updateGameEntry } from "../api";
import { Trash2 } from "lucide-react";
import FlashMessage from "../../../shared/components/FlashMessage/FlashMessage";
import FullPageLoading from "../../../shared/components/FullPageLoading";
import {
  gameStatusOptions,
  getGameStatusLabel,
  isGameStatus,
} from "../gameStatus";

type GameEntryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  game: GameCompleteResponse;
  status: GameStatus | null;
  isInLibrary: boolean;
  onSaved: (status: GameLibraryStatus) => void;
};

type GameEntryModalContentProps = Omit<GameEntryModalProps, "isOpen">;

const GameEntryModalContent = ({
  onClose,
  game,
  status,
  isInLibrary,
  onSaved,
}: GameEntryModalContentProps) => {
  const [selectedStatus, setSelectedStatus] = useState<GameStatus | "">(
    status ?? "",
  );
  const [flashMessage, setFlashMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmingRemoval, setIsConfirmingRemoval] = useState(false);

  const handleStatusChange = (value: string) => {
    if (isGameStatus(value)) {
      setSelectedStatus(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) {
      setFlashMessage("Choisis un statut avant d'ajouter le jeu.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        providerId: game.id,
        status: selectedStatus,
      };

      if (isInLibrary) {
        await updateGameEntry(payload);
      } else {
        await createGameEntry(payload);
      }

      onSaved({
        isInLibrary: true,
        playStatus: selectedStatus,
        playStatusLabel: getGameStatusLabel(selectedStatus),
      });

      onClose();
    } catch {
      setFlashMessage(
        isInLibrary
          ? "Impossible de mettre à jour ce jeu."
          : "Impossible d'ajouter ce jeu à ta liste.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);

    try {
      await deleteGameEntry(game.id);

      onSaved({
        isInLibrary: false,
        playStatus: null,
        playStatusLabel: null,
      });

      onClose();
    } catch {
      setIsConfirmingRemoval(false);
      setFlashMessage("Impossible de retirer ce jeu de ta liste.");
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
                Choisis où tu en es avec ce jeu.
              </p>
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            {game.coverUrl && (
              <img
                src={game.coverUrl}
                alt={`Couverture de ${game.title}`}
                className="h-36 w-24 shrink-0 rounded-md object-cover shadow-md"
              />
            )}

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-zinc-100">
                {game.title}
              </h3>

              {game.developer && (
                <p className="mt-1 text-sm text-zinc-400">
                  Développeur : {game.developer}
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {game.releaseYear && (
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {game.releaseYear}
                  </span>
                )}

                {game.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Dropdown
              label="Statut"
              name="status"
              value={selectedStatus}
              options={gameStatusOptions}
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
          {isConfirmingRemoval ? (
            // Confirmation avant de retirer : l'entrée et son statut seront perdus.
            <div className="space-y-4 rounded-lg border border-rose-900/50 bg-rose-950/20 p-4">
              <p className="text-sm text-zinc-200">
                Retirer « {game.title} » de ta liste ? Son statut sera perdu.
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
                  {isInLibrary ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Le contenu n'est monté que modale ouverte : son état (statut choisi, message)
// repart donc des props à chaque ouverture, sans useEffect de réinitialisation.
const GameEntryModal = ({ isOpen, ...props }: GameEntryModalProps) => {
  if (!isOpen) {
    return null;
  }

  return <GameEntryModalContent key={props.status ?? ""} {...props} />;
};

export default GameEntryModal;
