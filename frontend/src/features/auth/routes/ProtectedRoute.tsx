import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AuthRouteStatus from "../AuthRouteStatus";
import Button from "../../../shared/components/Button/Button";
import ButtonLink from "../../../shared/components/Button/ButtonLink";

const ProtectedRoute = () => {
  const location = useLocation();
  const { error, isAuthenticated, refreshUser, status } = useAuth();

  if (status === "loading") {
    return (
      <AuthRouteStatus
        title="Vérification en cours"
        message="Validation de votre session en cours… Cela peut prendre jusqu’à 15 secondes."
      />
    );
  }

  if (status === "error") {
    return (
      <AuthRouteStatus
        title="Session indisponible"
        message={error ?? "Impossible de vérifier votre session."}
        action={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="primary"
              size="sm"
              className="h-10"
              onClick={() => void refreshUser()}
            >
              Réessayer
            </Button>
            <ButtonLink to="/login" variant="secondary" size="sm" className="h-10">
              Connexion
            </ButtonLink>
          </div>
        }
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
