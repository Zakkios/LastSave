import { Link, useParams } from "react-router";
import { ChevronLeft, Gamepad2, Info } from "lucide-react";
import { Card, CardContent } from "../shared/components/Card/Card";

const GameDetailPage = () => {
  const { id } = useParams<{ id: string }>();

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Colonne Gauche : Placeholder Couverture */}
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="aspect-[2/3] w-full flex items-center justify-center bg-zinc-900 border-zinc-800 border-dashed border-2">
            <div className="text-center p-6">
              <Gamepad2 className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-600 text-sm font-medium">Image non disponible</p>
            </div>
          </Card>
        </div>

        {/* Colonne Droite : Placeholder Infos */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-50 lg:text-5xl">
              Détail du Jeu
            </h1>
            <p className="text-xl text-emerald-400 font-medium italic">
              ID: {id} — Intégration IGDB à venir
            </p>
          </div>

          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="flex items-start gap-4 p-6">
              <Info className="h-6 w-6 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-50">Page en construction</h3>
                <p className="text-zinc-400 leading-relaxed">
                  La fiche détaillée des jeux vidéo, incluant les captures d'écran, les plateformes et les notes IGDB, sera disponible dès que l'API backend sera finalisée.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-40 grayscale">
            <div className="h-32 rounded-xl border border-zinc-800 bg-zinc-900/50"></div>
            <div className="h-32 rounded-xl border border-zinc-800 bg-zinc-900/50"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetailPage;
