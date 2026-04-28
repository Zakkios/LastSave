import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AuthRouteStatus from "../AuthRouteStatus";

const ProtectedRoute = () => {
  const location = useLocation();
  const { error, isAuthenticated, refreshUser, status } = useAuth();

  if (status === "loading") {
    return (
      <AuthRouteStatus
        title="Vérification en cours"
        message="Votre session est en cours de validation."
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
            <button
              className="h-10 rounded-md bg-emerald-400 px-4 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
              onClick={() => void refreshUser()}
              type="button"
            >
              Réessayer
            </button>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-semibold text-zinc-200 transition hover:border-emerald-300/40 hover:text-emerald-200"
              to="/login"
            >
              Connexion
            </Link>
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
