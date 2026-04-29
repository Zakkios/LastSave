import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useManga } from "../features/manga/hooks/useManga";
import { MangaCard } from "../features/manga/components/MangaCard";

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { manga, loading, error, fetchMangaById } = useManga();

  useEffect(() => {
    if (id) {
      void fetchMangaById(id);
    }
  }, [id, fetchMangaById]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <div className="w-full max-w-lg">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
        >
          ← Retour à l'accueil
        </Link>

        {loading && (
          <div className="animate-pulse flex flex-col items-center space-y-4">
            <div className="h-8 w-48 bg-zinc-800 rounded"></div>
            <div className="h-64 w-full bg-zinc-800 rounded"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {manga && !loading && (
          <MangaCard manga={manga} />
        )}

        {!id && !loading && (
          <div className="text-center text-zinc-500">
            Manga introuvable.
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaDetailPage;
