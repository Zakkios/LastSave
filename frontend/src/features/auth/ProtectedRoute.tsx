import type { ReactNode } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./useAuth";

interface RouteStatusProps {
  title: string;
  message: string;
  action?: ReactNode;
}

const RouteStatus = ({ title, message, action }: RouteStatusProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090f] px-6 text-zinc-50">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-zinc-950/75 p-6 text-center shadow-2xl shadow-black/40">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          Session
        </p>
        <h1 className="mt-3 text-2xl font-semibold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{message}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </section>
    </main>
  );
};

const ProtectedRoute = () => {
  const location = useLocation();
  const { error, isAuthenticated, refreshUser, status } = useAuth();

  if (status === "loading") {
    return (
      <RouteStatus
        title="Vérification en cours"
        message="Votre session est en cours de validation."
      />
    );
  }

  if (status === "error") {
    return (
      <RouteStatus
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
