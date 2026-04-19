import { Link } from "react-router";
import AuthPageLayout from "../features/auth/AuthPageLayout";
import LoginForm from "../features/auth/LoginForm";

const LoginPage = () => {
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
      <LoginForm />
    </AuthPageLayout>
  );
};

export default LoginPage;
