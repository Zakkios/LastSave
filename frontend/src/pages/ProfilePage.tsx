import { User, LogOut, Settings, Shield, Bell, Moon } from "lucide-react";
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
        title="Mon Profil"
        description="Gérez les informations de votre compte et vos préférences."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations Compte */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <CardTitle>{user?.username || "Utilisateur"}</CardTitle>
                <p className="text-sm text-zinc-500">Membre LastSave</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Nom d'utilisateur
                </p>
                <p className="text-zinc-100">
                  {user?.username || "Non renseigné"}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <Button
                  variant="danger"
                  className="w-full justify-center gap-2"
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
                Les options de changement de mot de passe et de double
                authentification seront disponibles prochainement.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-zinc-500 cursor-not-allowed"
                disabled
              >
                Modifier le mot de passe
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Préférences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-emerald-500" />
                Préférences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">Thème</p>
                    <p className="text-xs text-zinc-500">Sombre (par défaut)</p>
                  </div>
                </div>
                <div className="h-6 w-10 rounded-full bg-indigo-600 relative">
                  <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      Notifications
                    </p>
                    <p className="text-xs text-zinc-500">Désactivées</p>
                  </div>
                </div>
                <div className="h-6 w-10 rounded-full bg-zinc-700 relative">
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-zinc-400 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-100">Langue</p>
                  <p className="text-xs text-zinc-500">Français</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-6">
              <h4 className="font-bold text-emerald-400">
                Pourquoi pas d'édition ?
              </h4>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                LastSave est en cours de développement. La modification des
                informations de profil nécessite une mise à jour du backend qui
                est prévue pour la prochaine version.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
