import { Link } from "react-router";
import AuthPageLayout from "../features/auth/AuthPageLayout";
import RegisterForm from "../features/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <AuthPageLayout
      eyebrow="Inscription"
      title="Créez votre espace de suivi."
      description="Un compte suffit pour garder vos mangas et jeux au même endroit, sans interface chargée."
      highlights={["Listes personnelles", "Accès sécurisé", "Thème sombre"]}
      formLabel="Formulaire d'inscription"
      formTitle="Créer un compte"
      formDescription="Utilisez une adresse email valide et un mot de passe solide."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            Se connecter
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthPageLayout>
  );
};

export default RegisterPage;
