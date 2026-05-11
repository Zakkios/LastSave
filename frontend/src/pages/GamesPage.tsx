import { Link } from "react-router";
import { Gamepad2 } from "lucide-react";
import PageHeader from "../shared/components/PageHeader";
import EmptyState from "../shared/components/EmptyState";
import Button from "../shared/components/Button/Button";

const GamesPage = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mes Jeux" 
        description="Gérez votre collection de jeux vidéo."
        action={
          <Link to="/search">
            <Button variant="primary">Ajouter un jeu</Button>
          </Link>
        }
      />

      <EmptyState 
        icon={<Gamepad2 className="h-6 w-6 text-zinc-400" />}
        title="Bibliothèque de jeux bientôt disponible"
        description="L'intégration avec IGDB et la gestion de votre collection de jeux arrivent très prochainement. Le backend doit être configuré."
        action={
          <Link to="/search">
            <Button variant="ghost">Explorer les jeux</Button>
          </Link>
        }
      />
    </div>
  );
};

export default GamesPage;
