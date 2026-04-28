import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AuthRouteStatus from "../AuthRouteStatus";

const GuestRoute = () => {
  const { isAuthenticated, status } = useAuth();

  if (status === "loading") {
    return (
      <AuthRouteStatus
        title="Vérification en cours"
        message="Votre session est en cours de validation."
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};

export default GuestRoute;
