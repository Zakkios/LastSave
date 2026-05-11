import { Library, Gamepad2, PlayCircle, Clock, CheckCircle2 } from "lucide-react";
import PageHeader from "../shared/components/PageHeader";
import StatCard from "../shared/components/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../shared/components/Card/Card";
import EmptyState from "../shared/components/EmptyState";
import { useMangaLibrary } from "../features/manga/hooks/useMangaLibrary";

const DashboardPage = () => {
  const { items, loading } = useMangaLibrary();

  // Basic stats derived from library items
  const readingMangas = items.filter(m => m.readingStatus === "reading").length;
  const completedMangas = items.filter(m => m.readingStatus === "completed").length;
  const totalMangas = items.length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Bienvenue sur votre espace personnel LastSave."
      />
      
      {/* Section Statistiques */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Mangas en cours" 
          value={loading ? "..." : readingMangas} 
          icon={<Library className="h-4 w-4" />}
        />
        <StatCard 
          title="Jeux en cours" 
          value="—" 
          description="Bientôt disponible"
          icon={<Gamepad2 className="h-4 w-4" />}
        />
        <StatCard 
          title="Mangas terminés" 
          value={loading ? "..." : completedMangas} 
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard 
          title="Total collection" 
          value={loading ? "..." : totalMangas} 
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Colonne Gauche/Milieu : Contenu en cours */}
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
              <PlayCircle className="h-5 w-5 text-indigo-500" />
              Continuer
            </h3>
            
            {readingMangas > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {items
                  .filter(m => m.readingStatus === "reading")
                  .slice(0, 4)
                  .map(manga => (
                    <Card key={manga.id} className="hover:border-zinc-700 transition-colors">
                      <CardContent className="p-4 flex gap-4">
                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-zinc-800">
                          {manga.coverUrl && (
                            <img src={manga.coverUrl} alt={manga.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="font-bold text-zinc-100 truncate">{manga.title}</h4>
                          <p className="text-sm text-zinc-500 truncate">{manga.author}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <EmptyState 
                title="Rien en cours" 
                description="Vous n'avez aucun manga ou jeu marqué comme 'en cours'."
              />
            )}
          </section>

          {/* TODO: Futur endpoint backend GET /activities */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
              <Clock className="h-5 w-5 text-emerald-500" />
              Activité récente
            </h3>
            <Card>
              <CardContent className="py-12 text-center text-zinc-500 italic">
                L'historique de vos activités sera affiché ici.
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Colonne Droite : Widgets Secondaires */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-zinc-500">
                Prochaines sorties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400 italic">
                Bientôt : suivez les dates de sortie de vos séries préférées.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-500/5 border-indigo-500/20">
            <CardContent className="p-6">
              <h4 className="font-bold text-indigo-400">Astuce LastSave</h4>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Utilisez la recherche pour ajouter rapidement des mangas à votre bibliothèque et suivre votre progression !
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
