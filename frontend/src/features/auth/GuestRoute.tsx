import { Navigate, Outlet } from "react-router";
import AuthRouteStatus from "./AuthRouteStatus";
import { useAuth } from "./useAuth";

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
