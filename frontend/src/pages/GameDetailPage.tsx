import { Link, useParams } from "react-router";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { GameCard } from "../features/game/components/GameCard";
import { useGameDetail } from "../features/game/hooks/useGameDetail";
import { Card, CardContent } from "../shared/components/Card/Card";
import ButtonLink from "../shared/components/Button/ButtonLink";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { game, loading, error } = useGameDetail(id);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          to="/search?tab=games"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à la recherche
        </Link>
      </div>

      {loading && (
        <div className="flex min-h-100 flex-col items-center justify-center gap-4 py-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          <p className="text-zinc-400">Chargement des détails du jeu...</p>
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
            <ButtonLink to="/search?tab=games" variant="secondary" size="sm" className="mt-4">
              Retourner à la recherche
            </ButtonLink>
          </CardContent>
        </Card>
      )}

      {game && !loading && <GameCard game={game} />}
    </div>
  );
};

export default GameDetailPage;
