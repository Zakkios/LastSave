import { useState } from "react";
import {
  BookOpen,
  Layers,
  Calendar,
  CheckCircle2,
  Plus,
  Pencil,
  Hash,
  Info,
} from "lucide-react";
import Button from "../../../shared/components/Button/Button";
import StatusBadge from "./StatusBadge/StatusBadge";
import type { MangaCompleteResponse, MangaLibraryStatus } from "../types";
import MangaEntryModal from "./MangaEntryModal";
import { Card, CardContent } from "../../../shared/components/Card/Card";

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Couverture et Actions Rapides */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-2/3 w-full bg-zinc-800">
                {manga.coverUrl ? (
                  <img
                    src={manga.coverUrl}
                    alt={`Couverture de ${manga.title}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-500">
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
                libraryStatus.readingStatusLabel && (
                  <div className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 py-3">
                    <span className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">
                      Statut actuel :
                    </span>
                    <StatusBadge
                      label={libraryStatus.readingStatusLabel}
                      status={libraryStatus.readingStatus!}
                    />
                  </div>
                )}
            </div>

            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Année
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {manga.publicationYear || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Publication
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {manga.publicationStatus || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Tomes
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {manga.numberOfVolumes || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500 flex items-center gap-2">
                    <Hash className="h-4 w-4" /> Chapitres
                  </span>
                  <span className="text-zinc-200 font-medium">
                    {manga.numberOfChapters || "—"}
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
              {manga.title}
            </h1>
            <p className="text-xl text-indigo-400 font-medium">
              {manga.author || "Auteur inconnu"}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
              <Info className="h-5 w-5 text-indigo-500" />
              Synopsis
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg max-w-none">
              {manga.description || "Aucun synopsis disponible."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.genres && manga.genres.length > 0 ? (
                  manga.genres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 transition-colors hover:border-indigo-500/50"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 italic">
                    Aucun genre listé
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                <Hash className="h-4 w-4" /> Thèmes
              </h3>
              <div className="flex flex-wrap gap-2">
                {manga.themes && manga.themes.length > 0 ? (
                  manga.themes.map((theme) => (
                    <span
                      key={theme}
                      className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 transition-colors hover:border-emerald-500/50"
                    >
                      {theme}
                    </span>
                  ))
                ) : (
                  <span className="text-zinc-600 italic">
                    Aucun thème listé
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MangaCard;
