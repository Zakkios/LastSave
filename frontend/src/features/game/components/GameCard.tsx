import { useState } from "react";
import {
  Calendar,
  Gamepad2,
  Hash,
  Info,
  Monitor,
  Pencil,
  Plus,
  Star,
  Swords,
} from "lucide-react";
import Button from "../../../shared/components/Button/Button";
import { Card, CardContent } from "../../../shared/components/Card/Card";
import GameStatusBadge from "./GameStatusBadge";
import GameEntryModal from "./GameEntryModal";
import type { GameCompleteResponse, GameLibraryStatus } from "../types";

interface GameCardProps {
  game: GameCompleteResponse;
}

interface TagListProps {
  items: string[];
  emptyLabel: string;
  hoverClassName: string;
}

const TagList = ({ items, emptyLabel, hoverClassName }: TagListProps) => (
  <div className="flex flex-wrap gap-2">
    {items.length > 0 ? (
      items.map((item) => (
        <span
          key={item}
          className={`rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 transition-colors ${hoverClassName}`}
        >
          {item}
        </span>
      ))
    ) : (
      <span className="text-zinc-600 italic">{emptyLabel}</span>
    )}
  </div>
);

// Fiche complète d'un jeu : même mise en page que MangaCard.
export const GameCard = ({ game }: GameCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Statut enregistré depuis la modale, gardé tant qu'on reste sur le même jeu.
  const [localLibraryStatus, setLocalLibraryStatus] = useState<{
    gameId: number;
    status: GameLibraryStatus;
  } | null>(null);

  const libraryStatus =
    localLibraryStatus?.gameId === game.id
      ? localLibraryStatus.status
      : {
          isInLibrary: game.isInLibrary,
          playStatus: game.playStatus,
          playStatusLabel: game.playStatusLabel,
        };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSaved = (status: GameLibraryStatus) => {
    setLocalLibraryStatus({
      gameId: game.id,
      status,
    });
  };

  return (
    <>
      <GameEntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        game={game}
        status={libraryStatus.playStatus}
        isInLibrary={libraryStatus.isInLibrary}
        onSaved={handleSaved}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Couverture et Actions Rapides */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-3/4 w-full bg-zinc-800">
                {game.coverUrl ? (
                  <img
                    src={game.coverUrl}
                    alt={`Couverture de ${game.title}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-500">
                    <Gamepad2 className="h-12 w-12 text-zinc-700" />
                    Pas d’image
                  </div>
                )}
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full justify-center gap-2"
                onClick={openModal}
              >
                {libraryStatus.isInLibrary ? (
                  <>
                    <Pencil className="h-4 w-4" />
                    Modifier mon statut
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Ajouter à ma liste
                  </>
                )}
              </Button>

              {libraryStatus.isInLibrary &&
                libraryStatus.playStatus &&
                libraryStatus.playStatusLabel && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 py-3">
                    <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">
                      Statut actuel :
                    </span>
                    <GameStatusBadge
                      label={libraryStatus.playStatusLabel}
                      status={libraryStatus.playStatus}
                    />
                  </div>
                )}
            </div>

            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Sortie
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {game.releaseYear || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Star className="h-4 w-4" /> Note IGDB
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {game.rating !== null ? `${game.rating} / 100` : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Colonne Droite : Informations Détaillées */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-50 lg:text-5xl">
              {game.title}
            </h1>
            <p className="text-xl text-indigo-400 font-medium">
              {game.developer || "Développeur inconnu"}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
              <Info className="h-5 w-5 text-indigo-500" />
              Résumé
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg max-w-none">
              {game.summary || "Aucun résumé disponible."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Swords className="h-4 w-4" /> Genres
              </h3>
              <TagList
                items={game.genres}
                emptyLabel="Aucun genre listé"
                hoverClassName="hover:border-indigo-500/50"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Hash className="h-4 w-4" /> Thèmes
              </h3>
              <TagList
                items={game.themes}
                emptyLabel="Aucun thème listé"
                hoverClassName="hover:border-emerald-500/50"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Monitor className="h-4 w-4" /> Plateformes
              </h3>
              <TagList
                items={game.platforms}
                emptyLabel="Aucune plateforme listée"
                hoverClassName="hover:border-sky-500/50"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
