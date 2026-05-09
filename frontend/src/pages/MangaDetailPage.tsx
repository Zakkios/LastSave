import { Link, useParams } from "react-router";
import { MangaCard } from "../features/manga/components/MangaCard";
import { useMangaDetail } from "../features/manga/hooks/useMangaDetail";

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { manga, loading, error } = useMangaDetail(id);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          ← Retour à l'accueil
        </Link>

        {loading && (
          <div className="flex animate-pulse flex-col items-center space-y-4">
            <div className="h-8 w-48 rounded bg-zinc-800"></div>
            <div className="h-64 w-full rounded bg-zinc-800"></div>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-4 text-center text-red-200">
            {error}
          </div>
        )}

        {manga && !loading && <MangaCard manga={manga} />}

        {!id && !loading && (
          <div className="text-center text-zinc-500">Manga introuvable.</div>
        )}
      </div>
    </div>
  );
};

export default MangaDetailPage;
