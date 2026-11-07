import { LogOut, Shield, User } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import useLogout from "../features/auth/hooks/useLogout";
import PageHeader from "../shared/components/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../shared/components/Card/Card";
import Button from "../shared/components/Button/Button";
import FullPageLoading from "../shared/components/FullPageLoading";

const ProfilePage = () => {
  const { user, status } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  if (status === "loading") {
    return <FullPageLoading />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Mon profil"
        description="Les informations de votre compte."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Adresse e-mail
              </p>
              <p className="break-all text-zinc-100">
                {user?.username || "Non renseignée"}
              </p>
            </div>

            {/* Sur mobile, il n'y a pas de menu latéral : la déconnexion se fait ici. */}
            <div className="pt-4 border-t border-zinc-800">
              <Button
                variant="secondary-danger"
                size="sm"
                className="w-full"
                onClick={logout}
                disabled={logoutLoading}
              >
                <LogOut className="h-4 w-4" />
                {logoutLoading ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-400">
              La modification du mot de passe sera bientôt disponible.
            </p>
            <Button variant="secondary" size="sm" className="w-full" disabled>
              Modifier le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
