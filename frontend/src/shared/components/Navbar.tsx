import { Link } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import Button from "./Button/Button";
import useLogout from "../../features/auth/hooks/useLogout";
import FullPageLoading from "./FullPageLoading";

const Navbar = () => {
  const { status } = useAuth();
  const { logout, loading } = useLogout();

  const isAuthenticated = status === "authenticated";

  return (
    <>
      {loading && <FullPageLoading />}
      <nav className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between bg-background/80 backdrop-blur-sm border-zinc-800 border-b px-4 gap-3">
        <h1 className="md:text-2xl text-lg font-bold text-zinc-50">LastSave</h1>

        <div className="flex gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost">Mon profil</Button>
              <Button variant="primary" onClick={logout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Inscription</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
