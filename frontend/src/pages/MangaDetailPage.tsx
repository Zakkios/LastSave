import { Link, useParams } from "react-router";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { MangaCard } from "../features/manga/components/MangaCard";
import { useMangaDetail } from "../features/manga/hooks/useMangaDetail";
import { Card, CardContent } from "../shared/components/Card/Card";

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { manga, loading, error } = useMangaDetail(id);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à la recherche
        </Link>
      </div>

      {loading && (
        <div className="flex min-h-100 flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-zinc-400">Chargement des détails du manga...</p>
        </div>
      )}

      {error && !loading && (
        <Card className="border-red-900/50 bg-red-900/10">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-50">Une erreur est survenue</h3>
              <p className="text-red-400">{error}</p>
            </div>
            <Link to="/search" className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700">
              Retourner à la recherche
            </Link>
          </CardContent>
        </Card>
      )}

      {manga && !loading && <MangaCard manga={manga} />}

      {!id && !loading && (
        <div className="py-20 text-center text-zinc-500">
          Manga introuvable ou ID invalide.
        </div>
      )}
    </div>
  );
};

export default MangaDetailPage;
