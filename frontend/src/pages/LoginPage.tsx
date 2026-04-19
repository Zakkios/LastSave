import { Link, useLocation } from "react-router";
import AuthPageLayout from "../features/auth/AuthPageLayout";
import AuthFormFeedback from "../features/auth/AuthFormFeedback";
import LoginForm from "../features/auth/LoginForm";
import { getAuthFlashFromState } from "../features/auth/authFlash";

const LoginPage = () => {
  const location = useLocation();
  const flash = getAuthFlashFromState(location.state);

  return (
    <AuthPageLayout
      eyebrow="Connexion"
      title="Retrouvez votre espace de suivi."
      description="Connectez-vous pour accéder à vos listes de mangas et jeux, avec vos préférences déjà prêtes."
      highlights={["Session sécurisée", "Listes synchronisées", "Accès rapide"]}
      formLabel="Formulaire de connexion"
      formTitle="Se connecter"
      formDescription="Utilisez l'adresse email et le mot de passe de votre compte."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            Créer un compte
          </Link>
        </>
      }
    >
      <>
        {flash ? (
          <div className="mb-5">
            <AuthFormFeedback message={flash.message} status={flash.status} />
          </div>
        ) : null}

        <LoginForm />
      </>
    </AuthPageLayout>
  );
};

export default LoginPage;
